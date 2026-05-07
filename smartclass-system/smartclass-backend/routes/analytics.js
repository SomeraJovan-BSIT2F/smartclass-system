// routes/analytics.js
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const ctl = require('../controllers/analyticsController');

router.use(authenticate);

router.get('/institution', authorize('admin'),
  asyncHandler(ctl.institutionOverview));

router.get('/sections/:sectionId', authorize('teacher','admin'),
  asyncHandler(ctl.sectionAnalytics));

module.exports = router;
