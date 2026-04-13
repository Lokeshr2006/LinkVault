const prisma = require('../utils/prisma');

const getUrlAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const url = await prisma.url.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!url) return res.status(404).json({ error: 'URL not found' });

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalClicks, clicks, deviceBreakdown, countryBreakdown, browserBreakdown] =
      await Promise.all([
        prisma.click.count({ where: { urlId: id } }),

        prisma.click.findMany({
          where: { urlId: id, timestamp: { gte: since } },
          orderBy: { timestamp: 'desc' },
          take: 50,
          select: {
            timestamp: true, country: true,
            device: true, browser: true, referrer: true
          }
        }),

        prisma.click.groupBy({
          by: ['device'],
          where: { urlId: id },
          _count: { device: true }
        }),

        prisma.click.groupBy({
          by: ['country'],
          where: { urlId: id },
          _count: { country: true },
          orderBy: { _count: { country: 'desc' } },
          take: 10
        }),

        prisma.click.groupBy({
          by: ['browser'],
          where: { urlId: id },
          _count: { browser: true }
        })
      ]);

    // Daily clicks for chart
    const dailyClicks = await getDailyClicks(id, parseInt(days));

    const lastVisited = clicks[0]?.timestamp || null;

    res.json({
      url: {
        ...url,
        shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`
      },
      totalClicks,
      lastVisited,
      recentVisits: clicks,
      deviceBreakdown,
      countryBreakdown,
      browserBreakdown,
      dailyClicks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

const getDailyClicks = async (urlId, days) => {
  const clicks = await prisma.click.findMany({
    where: {
      urlId,
      timestamp: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    },
    select: { timestamp: true }
  });

  const map = {};
  clicks.forEach(c => {
    const date = c.timestamp.toISOString().split('T')[0];
    map[date] = (map[date] || 0) + 1;
  });

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    result.push({ date, clicks: map[date] || 0 });
  }
  return result;
};

const getPublicStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findFirst({
      where: {
        OR: [{ shortCode }, { customAlias: shortCode }]
      }
    });

    if (!url) return res.status(404).json({ error: 'Link not found' });

    const [totalClicks, deviceBreakdown, countryBreakdown, dailyClicks] =
      await Promise.all([
        prisma.click.count({ where: { urlId: url.id } }),
        prisma.click.groupBy({
          by: ['device'],
          where: { urlId: url.id },
          _count: { device: true }
        }),
        prisma.click.groupBy({
          by: ['country'],
          where: { urlId: url.id },
          _count: { country: true },
          orderBy: { _count: { country: 'desc' } },
          take: 5
        }),
        getDailyClicks(url.id, 14)
      ]);

    res.json({
      shortCode,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      totalClicks,
      createdAt: url.createdAt,
      deviceBreakdown,
      countryBreakdown,
      dailyClicks
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public stats' });
  }
};

module.exports = { getUrlAnalytics, getPublicStats };