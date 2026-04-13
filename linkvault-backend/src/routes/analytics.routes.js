const router = require('express').Router();
const { getUrlAnalytics, getPublicStats } = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/public/:shortCode', getPublicStats);
router.get('/:id', authenticate, getUrlAnalytics);

module.exports = router;