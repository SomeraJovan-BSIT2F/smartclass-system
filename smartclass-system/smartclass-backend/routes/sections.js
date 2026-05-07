// routes/sections.js
const router = require('express').Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/error');
const ctl = require('../controllers/sectionController');

router.use(authenticate);

router.get('/', asyncHandler(ctl.listSections));
router.get('/:id', asyncHandler(ctl.getSection));

router.post('/', authorize('admin'), [
  body('semesterId').isInt(),
  body('teacherId').isInt(),
  body('code').isString().notEmpty(),
  body('subject').isString().notEmpty(),
  validate,
], asyncHandler(ctl.createSection));

router.post('/:id/enrollments', authorize('admin'),
  asyncHandler(ctl.enrollStudent));

router.patch('/:id/archive', authorize('admin'),
  asyncHandler(ctl.archiveSection));

module.exports = router;
