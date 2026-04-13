const prisma = require('../utils/prisma');
const { generateShortCode } = require('../utils/nanoid.utils');
const router = require('express').Router();
const { body } = require('express-validator');
const {
  createUrl, getUserUrls, getUrlById,
  updateUrl, deleteUrl, getDashboardStats
} = require('../controllers/url.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/', authenticate, getUserUrls);
router.get('/:id', authenticate, getUrlById);

router.post('/', authenticate, [
  body('originalUrl').isURL().withMessage('Valid URL is required'),
  body('customAlias').optional().matches(/^[a-zA-Z0-9-_]+$/).isLength({ min: 3, max: 20 })
    .withMessage('Alias must be 3-20 characters (letters, numbers, hyphens, underscores)'),
  validate
], createUrl);

router.put('/:id', authenticate, [
  body('originalUrl').optional().isURL().withMessage('Valid URL is required'),
  validate
], updateUrl);

router.get('/redirect/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = require('../utils/prisma');
    const UAParser = require('ua-parser-js');

    const url = await prisma.url.findFirst({
      where: {
        OR: [{ shortCode }, { customAlias: shortCode }]
      }
    });

    if (!url) return res.status(404).json({ error: 'URL not found' });
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ error: 'Link expired' });
    }

    // Log click
    const parser = new UAParser(req.headers['user-agent']);
    const device = parser.getDevice().type || 'desktop';
    const browser = parser.getBrowser().name || 'unknown';
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';


    let country = 'unknown';
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
      const geoData = await geoRes.json();
      country = geoData.countryCode || 'unknown';
    } catch (_) {}

    prisma.click.create({
      data: { urlId: url.id, device, browser, ip, country }
    }).catch(console.error);

    res.json({ originalUrl: url.originalUrl });
  } catch (err) {
    res.status(500).json({ error: 'Redirect failed' });
  }
});
router.post('/bulk', authenticate, async (req, res) => {
  try {
    const { urls } = req.body;
    const userId = req.user.id;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'No URLs provided' });
    }

    if (urls.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 URLs allowed' });
    }

    const results = [];
    const errors = [];

    for (const item of urls) {
      try {
        new URL(item.originalUrl); // validate URL

        let shortCode;
        let isUnique = false;
        while (!isUnique) {
          shortCode = generateShortCode();
          const existing = await prisma.url.findUnique({ where: { shortCode } });
          if (!existing) isUnique = true;
        }

        const url = await prisma.url.create({
          data: {
            originalUrl: item.originalUrl,
            shortCode,
            customAlias: item.customAlias || null,
            userId,
            expiresAt: item.expiresAt ? new Date(item.expiresAt) : null
          }
        });

        results.push({
          originalUrl: item.originalUrl,
          shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`,
          shortCode: url.shortCode,
          status: 'success'
        });
      } catch (err) {
        errors.push({
          originalUrl: item.originalUrl,
          status: 'failed',
          error: err.message
        });
      }
    }

    res.status(201).json({
      message: `${results.length} URLs shortened successfully`,
      results,
      errors,
      total: urls.length,
      success: results.length,
      failed: errors.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bulk creation failed' });
  }
});


router.delete('/:id', authenticate, deleteUrl);

module.exports = router;
