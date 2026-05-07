// routes/qr.js
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const ctl = require('../controllers/qrController');

router.use(authenticate);

// Student fetches their own QR (PNG data URL)
router.get('/me', authorize('student'), asyncHandler(ctl.myQrImage));

// Admin issues / rotates a QR
router.post('/issue', authorize('admin'), asyncHandler(ctl.issueForStudent));

// Admin batch-issues for an entire section
router.post('/issue-batch', authorize('admin'),
  asyncHandler(ctl.issueBatchForSection));

// Teachers resolve a token before recording (used by the scanner)
router.post('/resolve', authorize('teacher','admin'),
  asyncHandler(ctl.resolveToken));

module.exports = router;
