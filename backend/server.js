import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import yahooFinance from 'yahoo-finance2';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Force Express to trust Vercel's routing proxy layer to allow clean HTTP-Only cookies
app.set('trust proxy', 1);

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "Admin";
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const SESSION_SECRET = process.env.SESSION_SECRET || "admin-secret";

/* =========================
   MIDDLEWARE & SECURITY
========================= */

// Dynamic CORS configurations
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173', 
  'https://full-stack-excell.vercel.app', 
  'https://full-stack-excell.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin + '/')) {
      return callback(null, true);
    }
    try {
      const url = new URL(origin);
      if (url.hostname.endsWith('.vercel.app') || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Stateless JWT cookie-based session middleware
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('='));
    }
  });

  const token = cookies.admin_sid;
  req.session = {};

  if (token) {
    try {
      const decoded = jwt.verify(token, SESSION_SECRET);
      req.session = decoded;
    } catch (err) {
      // Token invalid or expired, continue silently
    }
  }

  // Session destruction helper
  req.session.destroy = (callback) => {
    req.session = {};
    res.cookie("admin_sid", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      expires: new Date(0)
    });
    if (callback) callback(null);
  };

  next();
});

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

    // Secure, case-insensitive comparison framework
    const correctUsername = ADMIN_USERNAME.toLowerCase();
    const inputUsername = (username || "").trim().toLowerCase();

    // Pull directly from Vercel's encrypted environment variable vault
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (inputUsername !== correctUsername || !correctPassword || password !== correctPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    req.session.isAdmin = true;

    // Sign stateless JWT cookie
    const token = jwt.sign({ isAdmin: true }, SESSION_SECRET, { expiresIn: '1d' });
    res.cookie("admin_sid", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 Day
    });

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

app.get('/health', (req, res) => res.json({ status: 'ok' }));

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
   START SERVER
========================= */
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
  });
}

export default app;
