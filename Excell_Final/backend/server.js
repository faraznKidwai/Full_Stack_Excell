import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import yahooFinance from 'yahoo-finance2';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Increase payload size limits to handle large datasets
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
/**
 * Normalizes input row data to match the database schema.
 * Handles variations in case and spacing in keys.
 */
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
        } else if (cleanKey === 'companyname' || cleanKey === 'company' || cleanKey === 'name' ||  cleanKey === 'stockname') {
          normalizedRow.companyName = String(val).trim();
        } else if (cleanKey === 'status' || cleanKey === 'active') {
          if (typeof val === 'boolean') {
            normalizedRow.status = val;
          } else {
            const s = String(val).toLowerCase().trim();
            normalizedRow.status = (s === 'true' || s === 'halal' || s === 'active' || s === 'yes' || s === 'y');
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

  // Remove duplicate tickers in the payload, keeping the last seen
  const uniqueRowsMap = new Map();
  for (const row of normalized) {
    uniqueRowsMap.set(row.ticker, row);
  }

  return Array.from(uniqueRowsMap.values());
};

// API: Get all companies
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

// API: Overwrite / upsert all companies
app.post('/api/rows', async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: 'Payload must be an array of objects' });
    }

    const normalizedData = normalizeRows(payload);

    // Perform an overwrite transaction: clear table and insert normalized data
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing records
      await tx.company.deleteMany({});
      
      // 2. Insert new records if there are any
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
    res.status(500).json({ error: 'Failed to save data to database', details: error.message });
  }
});

// API: Get aggregate stats for hero cards
app.get('/api/stats', async (req, res) => {
  try {
    const totalStocks = await prisma.company.count();
    const halalStocks = await prisma.company.count({ where: { status: true } });
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
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// API: Yahoo Finance Proxy
app.get('/api/finance/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase().trim();
  
  try {
    const quote = await yahooFinance.quote(ticker);
    
    if (!quote) {
      return res.status(404).json({ error: `No market details found for ticker: ${ticker}` });
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
    console.warn(`Yahoo Finance API call failed for ticker: ${ticker}. Details:`, error.message);
    res.status(404).json({
      error: 'Failed to fetch finance details from Yahoo Finance',
      message: error.message,
      ticker
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
