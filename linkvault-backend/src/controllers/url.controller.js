const prisma = require('../utils/prisma');
const { generateShortCode } = require('../utils/nanoid.utils');

const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user.id;

    // Check custom alias availability
    if (customAlias) {
      const existing = await prisma.url.findUnique({
        where: { customAlias }
      });
      if (existing) {
        return res.status(409).json({ error: 'Custom alias already taken' });
      }
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    while (!isUnique) {
      shortCode = generateShortCode();
      const existing = await prisma.url.findUnique({ where: { shortCode } });
      if (!existing) isUnique = true;
    }

    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        customAlias: customAlias || null,
        userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    const shortUrl = `${process.env.BASE_URL}/${customAlias || shortCode}`;

    res.status(201).json({
      message: 'Short URL created successfully',
      url: { ...url, shortUrl }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
};

const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(search && {
        OR: [
          { originalUrl: { contains: search, mode: 'insensitive' } },
          { shortCode: { contains: search, mode: 'insensitive' } },
          { customAlias: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [urls, total] = await Promise.all([
      prisma.url.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          _count: { select: { clicks: true } },
          clicks: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            select: { timestamp: true }
          }
        }
      }),
      prisma.url.count({ where })
    ]);

    const formattedUrls = urls.map(url => ({
      ...url,
      shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`,
      totalClicks: url._count.clicks,
      lastVisited: url.clicks[0]?.timestamp || null
    }));

    res.json({
      urls: formattedUrls,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
};

const getUrlById = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await prisma.url.findFirst({
      where: { id, userId: req.user.id },
      include: {
        _count: { select: { clicks: true } },
        clicks: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: { timestamp: true }
        }
      }
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      url: {
        ...url,
        shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`,
        totalClicks: url._count.clicks,
        lastVisited: url.clicks[0]?.timestamp || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
};

const updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalUrl, customAlias, expiresAt } = req.body;

    const url = await prisma.url.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Check new alias availability
    if (customAlias && customAlias !== url.customAlias) {
      const existing = await prisma.url.findUnique({ where: { customAlias } });
      if (existing) {
        return res.status(409).json({ error: 'Custom alias already taken' });
      }
    }

    const updated = await prisma.url.update({
      where: { id },
      data: {
        originalUrl: originalUrl || url.originalUrl,
        customAlias: customAlias || url.customAlias,
        expiresAt: expiresAt ? new Date(expiresAt) : url.expiresAt
      }
    });

    res.json({
      message: 'URL updated successfully',
      url: {
        ...updated,
        shortUrl: `${process.env.BASE_URL}/${updated.customAlias || updated.shortCode}`
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update URL' });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await prisma.url.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    await prisma.url.delete({ where: { id } });

    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete URL' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalLinks, totalClicks, recentUrls] = await Promise.all([
      prisma.url.count({ where: { userId } }),
      prisma.click.count({
        where: { url: { userId } }
      }),
      prisma.url.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          _count: { select: { clicks: true } },
          clicks: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            select: { timestamp: true }
          }
        }
      })
    ]);

    // Calculate growth (clicks this week vs last week)
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekClicks, lastWeekClicks] = await Promise.all([
      prisma.click.count({
        where: { url: { userId }, timestamp: { gte: weekAgo } }
      }),
      prisma.click.count({
        where: {
          url: { userId },
          timestamp: { gte: twoWeeksAgo, lt: weekAgo }
        }
      })
    ]);

    const growth = lastWeekClicks === 0
      ? 100
      : Math.round(((thisWeekClicks - lastWeekClicks) / lastWeekClicks) * 100);

    res.json({
      stats: { totalLinks, totalClicks, growth },
      recentUrls: recentUrls.map(url => ({
        ...url,
        shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`,
        totalClicks: url._count.clicks,
        lastVisited: url.clicks[0]?.timestamp || null
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = {
  createUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  getDashboardStats
};