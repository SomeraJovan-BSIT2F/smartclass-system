// middleware/validate.js — runs express-validator chains and returns 422 on failure
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({ error: 'Validation failed', details: errors.array() });
}

module.exports = { validate };
