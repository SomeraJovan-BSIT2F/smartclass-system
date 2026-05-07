// controllers/qrController.js — QR generation and lookup
const crypto = require('crypto');
const QRCode = require('qrcode');
const { pool } = require('../config/db');
const { HttpError } = require('../middleware/error');

const tokenHex = () => crypto.randomBytes(32).toString('hex');

// Issue or rotate a student's semester QR
async function issueForStudent(req, res) {
  const { studentId, semesterId } = req.body;

  // Fetch semester end date for expiry
  const [sems] = await pool.query(
    'SELECT end_date FROM semesters WHERE id = ?',
    [semesterId]
  );
  if (!sems[0]) throw new HttpError(404, 'Semester not found');
  const expiresAt = `${sems[0].end_date instanceof Date
    ? sems[0].end_date.toISOString().slice(0, 10)
    : sems[0].end_date} 23:59:59`;

  const token = tokenHex();
  // Upsert: revoke any existing for this student+semester, then insert
  await pool.query(
    `UPDATE qr_codes SET revoked = TRUE
     WHERE student_id = ? AND semester_id = ? AND revoked = FALSE`,
    [studentId, semesterId]
  );
  await pool.query(
    `INSERT INTO qr_codes (student_id, semester_id, token, expires_at)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE
       token = VALUES(token),
       expires_at = VALUES(expires_at),
       revoked = FALSE,
       issued_at = CURRENT_TIMESTAMP`,
    [studentId, semesterId, token, expiresAt]
  );

  res.status(201).json({ token, expiresAt });
}

// Issue QRs for an entire section in one call (admin convenience)
async function issueBatchForSection(req, res) {
  const { sectionId, semesterId } = req.body;
  const [students] = await pool.query(
    `SELECT student_id FROM enrollments
     WHERE section_id = ? AND status='enrolled'`,
    [sectionId]
  );
  const [sems] = await pool.query(
    'SELECT end_date FROM semesters WHERE id = ?', [semesterId]
  );
  if (!sems[0]) throw new HttpError(404, 'Semester not found');
  const expiresAt = `${sems[0].end_date instanceof Date
    ? sems[0].end_date.toISOString().slice(0, 10)
    : sems[0].end_date} 23:59:59`;

  for (const s of students) {
    const token = tokenHex();
    await pool.query(
      `INSERT INTO qr_codes (student_id, semester_id, token, expires_at)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE
         token = VALUES(token),
         expires_at = VALUES(expires_at),
         revoked = FALSE,
         issued_at = CURRENT_TIMESTAMP`,
      [s.student_id, semesterId, token, expiresAt]
    );
  }
  res.status(201).json({ count: students.length });
}

// Get QR for the currently-logged-in student (as PNG data URL)
async function myQrImage(req, res) {
  const [rows] = await pool.query(
    `SELECT q.token, q.expires_at, s.student_number
     FROM qr_codes q
     JOIN students s ON s.id = q.student_id
     WHERE s.user_id = ? AND q.revoked = FALSE
     ORDER BY q.issued_at DESC LIMIT 1`,
    [req.user.sub]
  );
  if (!rows[0]) throw new HttpError(404, 'No active QR code');

  const payload = JSON.stringify({
    t: rows[0].token,
    sn: rows[0].student_number,
  });
  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
  });
  res.json({
    dataUrl,
    studentNumber: rows[0].student_number,
    expiresAt: rows[0].expires_at,
  });
}

// Resolve a token → student (used by scanner before recording attendance)
async function resolveToken(req, res) {
  const { token } = req.body;
  const [rows] = await pool.query(
    `SELECT q.id AS qr_id, q.expires_at, q.revoked,
            s.id AS student_id, s.student_number,
            CONCAT(u.first_name,' ',u.last_name) AS name
     FROM qr_codes q
     JOIN students s ON s.id = q.student_id
     JOIN users u    ON u.id = s.user_id
     WHERE q.token = ? LIMIT 1`,
    [token]
  );
  if (!rows[0]) throw new HttpError(404, 'QR token not recognized');
  if (rows[0].revoked) throw new HttpError(410, 'QR has been revoked');
  if (new Date(rows[0].expires_at) < new Date()) {
    throw new HttpError(410, 'QR has expired');
  }
  res.json({ student: rows[0] });
}

module.exports = { issueForStudent, issueBatchForSection, myQrImage, resolveToken };
