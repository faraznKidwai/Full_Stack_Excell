import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import yahooFinance from 'yahoo-finance2';
import bcrypt from "bcrypt";
import session from "express-session";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Resolve directory paths for ES Modules to serve static assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD_HASH = "$2b$10$0gRpJQow6s3WlGlHPUWWfO4Z1UIYBAyiSPoYY9d7tb9ojAdg/KeZy";

const isProduction = process.env.NODE_ENV === 'production';

/* =========================
   MIDDLEWARE & SECURITY
========================= */

// Dynamic CORS adjustments for development flexibility
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    // In production Plan C, requests are same-domain, so origin might be undefined.
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "admin-secret",
    resave: false,
    saveUninitialized: false,
    name: "admin_sid", 
    cookie: {
      httpOnly: true,
      // Production demands secure cookies over HTTPS, Local fallback allows plain HTTP
      secure: isProduction, 
      // Lax handles same-site architecture flawlessly; 'none' is requested if domains completely fork
      sameSite: isProduction ? "none" : "lax", 
      maxAge: 24 * 60 * 60 * 1000 // 1 Day
    }
  })
);

/* =========================
   AUTH MIDDLEWARE
========================= */

const requireAdmin = (req, res, next) => {
  if (!req.session?.isAdmin) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }
  next();
};

/* =========================
   HELPERS
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
   AUTH ROUTES
========================= */

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    req.session.isAdmin = true;

    return res.json({
      success: true,
      message: "Logged in"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Login failed"
    });
  }
});

app.get("/api/admin/check", (req, res) => {
  return res.json({
    authenticated: req.session?.isAdmin === true
  });
});

app.post("/api/admin/logout", (req, res) => {
 try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Logout failed"
        });
      }

      // CRITICAL FIX: Clears your explicitly named cookie "admin_sid" instead of default "connect.sid"
      res.clearCookie("admin_sid"); 

      return res.json({
        success: true,
        message: "Logged out successfully"
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Logout failed"
    });
  }
});

/* =========================
   DATA ROUTES
========================= */

app.get('/api/rows', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { ticker: 'asc' }
    });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching rows:', error);
    res.status(500).json({ error: 'Failed to retrieve data from database' });
  }
});

app.post('/api/rows', requireAdmin, async (req, res) => {
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

    res.json({
      success: true,
      message: `Successfully saved ${normalizedData.length} records to the database.`,
      count: normalizedData.length
    });

  } catch (error) {
    console.error('Error saving rows:', error);
    res.status(500).json({
      error: 'Failed to save data to database',
      details: error.message
    });
  }
});

/* =========================
   STATS
========================= */

app.get('/api/stats', async (req, res) => {
  try {
    const totalStocks = await prisma.company.count();
    const halalStocks = await prisma.company.count({
      where: { status: true }
    });

    const sectorRows = await prisma.company.findMany({
      select: { sector: true },
      distinct: ['sector'],
      where: { sector: { not: null } },
    });

    res.json({
      totalStocks,
      halalStocks,
      sectorsCount: sectorRows.length,
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

/* =========================
   FINANCE API
========================= */

app.get('/api/finance/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase().trim();

  try {
    const quote = await yahooFinance.quote(ticker);

    if (!quote) {
      return res.status(404).json({
        error: `No market details found for ticker: ${ticker}`
      });
    }

    res.json({
      ticker,
      price: quote.regularMarketPrice ?? null,
      change: quote.regularMarketChange ?? null,
      changePercent: quote.regularMarketChangePercent ?? null,
      currency: quote.currency ?? 'USD',
      exchange: quote.fullExchangeName || quote.exchange || null,
      marketCap: quote.marketCap ?? null,
      volume: quote.regularMarketVolume ?? null,
      high: quote.regularMarketDayHigh ?? null,
      low: quote.regularMarketDayLow ?? null,
      open: quote.regularMarketOpen ?? null,
      prevClose: quote.regularMarketPreviousClose ?? null,
    });

  } catch (error) {
    console.warn(
      `Yahoo Finance API call failed for ticker: ${ticker}.`,
      error.message
    );

    res.status(404).json({
      error: 'Failed to fetch finance details from Yahoo Finance',
      message: error.message,
      ticker
    });
  }
});

/* =========================
   PLAN C: SERVE FRONTEND STATIC ASSETS
========================= */

// Direct Node to find and serve the production compiled assets folder
// Adjust '../frontend/dist' to point accurately from your server.js location to the frontend compiled directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// SPA Wildcard Catch-all Handler
// Ensures client-side routing links (e.g. /admin-login) do not crash upon browser reload
app.get('*', (req, res, next) => {
  // If the request targets a backend API endpoint that was typed improperly, skip out to avoid blank index response
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Backend server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
});