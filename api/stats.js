// api/stats.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    return res.status(200).json({
      totalStocks,
      halalStocks,
      sectorsCount: sectorRows.length,
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
}