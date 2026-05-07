// controllers/attendanceController.js
const { pool } = require('../config/db');
const { HttpError } = require('../middleware/error');

// Open or fetch today's session for a section
async function openSession(req, res) {
  const { sectionId } = req.body;

  // Verify teacher owns this section (teachers only)
  if (req.user.role === 'teacher') {
    const [own] = await pool.query(
      `SELECT s.id FROM sections s
       JOIN teachers t ON t.id = s.teacher_id
       WHERE s.id = ? AND t.user_id = ?`,
      [sectionId, req.user.sub]
    );
    if (!own[0]) throw new HttpError(403, 'Not your section');
  }

  const today = new Date().toISOString().slice(0, 10);
  const [exist] = await pool.query(
    `SELECT * FROM class_sessions
     WHERE section_id = ? AND session_date = ?`,
    [sectionId, today]
  );
  if (exist[0]) return res.json({ session: exist[0], created: false });

  const now = new Date();
  const [r] = await pool.query(
    `INSERT INTO class_sessions (section_id, session_date, started_at)
     VALUES (?,?,?)`,
    [sectionId, today, now]
  );
  const [created] = await pool.query(
    'SELECT * FROM class_sessions WHERE id = ?', [r.insertId]
  );
  res.status(201).json({ session: created[0], created: true });
}

async function closeSession(req, res) {
  const { id } = req.params;
  await pool.query(
    `UPDATE class_sessions SET ended_at = NOW() WHERE id = ?`, [id]
  );

  // Mark un-scanned enrolled students as absent
  await pool.query(
    `INSERT IGNORE INTO attendance (session_id, student_id, status, source)
     SELECT cs.id, e.student_id, 'absent', 'manual'
     FROM class_sessions cs
     JOIN enrollments e ON e.section_id = cs.section_id
     WHERE cs.id = ? AND e.status='enrolled'`,
    [id]
  );

  res.json({ ok: true });
}

// Record an attendance scan (QR or manual)
async function recordScan(req, res) {
  const { sessionId, qrToken, studentId, status = 'present' } = req.body;
  let resolvedStudentId = studentId;

  if (qrToken) {
    const [q] = await pool.query(
      `SELECT q.student_id, q.revoked, q.expires_at
       FROM qr_codes q WHERE q.token = ?`,
      [qrToken]
    );
    if (!q[0]) throw new HttpError(404, 'QR token not recognized');
    if (q[0].revoked) throw new HttpError(410, 'QR has been revoked');
    if (new Date(q[0].expires_at) < new Date()) {
      throw new HttpError(410, 'QR has expired');
    }
    resolvedStudentId = q[0].student_id;
  }
  if (!resolvedStudentId) throw new HttpError(400, 'studentId or qrToken required');

  // Confirm student is enrolled in this session's section
  const [chk] = await pool.query(
    `SELECT 1 FROM enrollments e
     JOIN class_sessions cs ON cs.section_id = e.section_id
     WHERE cs.id = ? AND e.student_id = ? AND e.status='enrolled'`,
    [sessionId, resolvedStudentId]
  );
  if (!chk[0]) throw new HttpError(400, 'Student not enrolled in this section');

  // INSERT IGNORE prevents duplicate scans (unique key on session_id, student_id)
  const [r] = await pool.query(
    `INSERT IGNORE INTO attendance
       (session_id, student_id, status, scanned_at, scanned_by, source)
     VALUES (?,?,?,?,?,?)`,
    [sessionId, resolvedStudentId, status, new Date(), req.user.sub,
     qrToken ? 'qr' : 'manual']
  );
  if (r.affectedRows === 0) {
    return res.status(200).json({
      duplicate: true,
      message: 'Already recorded for this session',
    });
  }

  // Notification to student
  const [stu] = await pool.query(
    'SELECT user_id FROM students WHERE id = ?', [resolvedStudentId]
  );
  if (stu[0]) {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body)
       VALUES (?,?,?,?)`,
      [stu[0].user_id, 'attendance', 'Attendance recorded',
       `Marked ${status} at ${new Date().toLocaleTimeString()}`]
    );
  }

  res.status(201).json({ ok: true });
}

async function listForSession(req, res) {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT a.*, CONCAT(u.first_name,' ',u.last_name) AS student_name,
            s.student_number
     FROM attendance a
     JOIN students s ON s.id = a.student_id
     JOIN users u    ON u.id = s.user_id
     WHERE a.session_id = ?
     ORDER BY a.scanned_at DESC`,
    [id]
  );
  res.json({ attendance: rows });
}

// Student's own history
async function myHistory(req, res) {
  const [rows] = await pool.query(
    `SELECT a.status, a.scanned_at, cs.session_date,
            sec.code AS section_code, sec.subject
     FROM attendance a
     JOIN students s     ON s.id = a.student_id
     JOIN class_sessions cs ON cs.id = a.session_id
     JOIN sections sec   ON sec.id = cs.section_id
     WHERE s.user_id = ?
     ORDER BY cs.session_date DESC LIMIT 200`,
    [req.user.sub]
  );

  // Aggregate
  const total = rows.length;
  const present = rows.filter(r => r.status === 'present').length;
  const late    = rows.filter(r => r.status === 'late').length;
  const absent  = rows.filter(r => r.status === 'absent').length;
  const excused = rows.filter(r => r.status === 'excused').length;
  const percentage = total ? Math.round(((present + late) / total) * 100) : 0;

  res.json({
    history: rows,
    summary: { total, present, late, absent, excused, percentage },
  });
}

module.exports = {
  openSession, closeSession, recordScan, listForSession, myHistory,
};
