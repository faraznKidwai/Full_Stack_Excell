// api/rows.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/* =========================
   HELPER FUNCTION
========================= */
const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return [];

  const normalized = rows
    .map(row => {
      const normalizedRow = {
        ticker: '',
        companyName: null,
        status: true,
        sector: null,
        industry: null
      };

      for (const [key, val] of Object.entries(row)) {
        if (val === undefined || val === null) continue;

        const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (cleanKey === 'ticker' || cleanKey === 'symbol') {
          normalizedRow.ticker = String(val).trim().toUpperCase();
        } else if (
          cleanKey === 'companyname' ||
          cleanKey === 'company' ||
          cleanKey === 'name' ||
          cleanKey === 'stockname'
        ) {
          normalizedRow.companyName = String(val).trim();
        } else if (cleanKey === 'status' || cleanKey === 'active') {
          if (typeof val === 'boolean') {
            normalizedRow.status = val;
          } else {
            const s = String(val).toLowerCase().trim();
            normalizedRow.status =
              (s === 'true' || s === 'halal' || s === 'active' || s === 'yes' || s === 'y');
          }
        } else if (cleanKey === 'sector') {
          normalizedRow.sector = String(val).trim();
        } else if (cleanKey === 'industry') {
          normalizedRow.industry = String(val).trim();
        }
      }

      return normalizedRow;
    })
    .filter(row => row.ticker && row.ticker.length > 0);

  const uniqueRowsMap = new Map();

  for (const row of normalized) {
    uniqueRowsMap.set(row.ticker, row);
  }

  return Array.from(uniqueRowsMap.values());
};

/* =========================
   SERVERLESS ROUTE HANDLER
========================= */
export default async function handler(req, res) {
  // --- HANDLE GET REQUEST ---
  if (req.method === 'GET') {
    try {
      const companies = await prisma.company.findMany({
        orderBy: { ticker: 'asc' }
      });
      return res.status(200).json(companies);
    } catch (error) {
      console.error('Error fetching rows:', error);
      return res.status(500).json({ error: 'Failed to retrieve data from database' });
    }
  }

  // --- HANDLE POST REQUEST (PROTECTED ADMIN ROUTE) ---
  if (req.method === 'POST') {
    // 1. Replicate requireAdmin Middleware via JWT Verification
    const cookieHeader = req.headers.cookie || '';
    const token = cookieHeader
      .split('; ')
      .find(row => row.startsWith('admin_token='))
      ?.split('=')[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'fallback-secret');
      if (decoded.isAdmin !== true) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Execute Data Population Logic
    try {
      const payload = req.body;

      if (!Array.isArray(payload)) {
        return res.status(400).json({
          error: 'Payload must be an array of objects'
        });
      }

      const normalizedData = normalizeRows(payload);

      await prisma.$transaction(async (tx) => {
        await tx.company.deleteMany({});

        if (normalizedData.length > 0) {
          await tx.company.createMany({
            data: normalizedData
          });
        }
      });

      return res.status(200).json({
        success: true,
        message: `Successfully saved ${normalizedData.length} records to the database.`,
        count: normalizedData.length
      });

    } catch (error) {
      console.error('Error saving rows:', error);
      return res.status(500).json({
        error: 'Failed to save data to database',
        details: error.message
      });
    }
  }

  // Fallback for unexpected HTTP methods
  return res.status(405).json({ error: 'Method not allowed' });
}