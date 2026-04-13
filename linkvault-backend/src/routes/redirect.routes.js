const router = require('express').Router();
const UAParser = require('ua-parser-js');
const prisma = require('../utils/prisma');


router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findFirst({
      where: {
        OR: [{ shortCode }, { customAlias: shortCode }]
      }
    });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Check expiry
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ error: 'This link has expired' });
    }

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const device = parser.getDevice().type || 'desktop';
    const browser = parser.getBrowser().name || 'unknown';

    // Get IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress || 'unknown';


    // Get country via free IP API (no key needed)
    let country = 'unknown';
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
      const geoData = await geoRes.json();
      country = geoData.countryCode || 'unknown';
    } catch (_) {}

    // Log click asynchronously
    prisma.click.create({
      data: { urlId: url.id, device, browser, ip, country }
    }).catch(console.error);

    // Redirect
    return res.redirect(302, url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Redirect failed' });
  }
});

module.exports = router;
