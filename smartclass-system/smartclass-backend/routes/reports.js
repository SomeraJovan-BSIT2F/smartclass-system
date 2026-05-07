// routes/reports.js — PDF generation endpoints
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const ctl = require('../controllers/reportController');

router.use(authenticate);

// Section attendance report (teacher / admin)
router.get('/attendance/sections/:sectionId.pdf',
  authorize('teacher','admin'),
  asyncHandler(ctl.attendancePdf));

// Student's own performance report
router.get('/performance/me.pdf',
  authorize('student'),
  asyncHandler(ctl.myPerformancePdf));

module.exports = router;
