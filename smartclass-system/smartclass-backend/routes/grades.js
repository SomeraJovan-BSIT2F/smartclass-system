// routes/grades.js
const router = require('express').Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/error');
const ctl = require('../controllers/gradeController');

router.use(authenticate);

router.get('/items', authorize('teacher','admin'), asyncHandler(ctl.listItems));

router.post('/items', authorize('teacher','admin'), [
  body('sectionId').isInt(),
  body('title').isString().notEmpty(),
  body('category').isIn(['quiz','activity','participation','exam','recitation']),
  body('maxScore').isFloat({ gt: 0 }),
  validate,
], asyncHandler(ctl.createItem));

router.post('/', authorize('teacher','admin'), [
  body('gradeItemId').isInt(),
  body('studentId').isInt(),
  body('score').isFloat(),
  validate,
], asyncHandler(ctl.recordGrade));

router.get('/me', authorize('student'), asyncHandler(ctl.myGrades));

router.get('/sections/:sectionId/roster', authorize('teacher','admin'),
  asyncHandler(ctl.classRoster));

module.exports = router;
