// controllers/reportController.js — PDF report endpoints
const { pool } = require('../config/db');
const { HttpError } = require('../middleware/error');
const { attendanceReport, studentPerformanceReport } = require('../utils/pdf');

async function attendancePdf(req, res) {
  const { sectionId } = req.params;

  const [secRows] = await pool.query(
    'SELECT * FROM sections WHERE id = ?', [sectionId]
  );
  if (!secRows[0]) throw new HttpError(404, 'Section not found');

  const [students] = await pool.query(
    `SELECT s.student_number,
            CONCAT(u.first_name,' ',u.last_name) AS name,
            (SELECT ROUND(SUM(a.status IN ('present','late')) * 100.0 /
                          NULLIF(COUNT(*),0), 1)
             FROM attendance a
             JOIN class_sessions cs ON cs.id = a.session_id
             WHERE cs.section_id = ? AND a.student_id = s.id) AS attendance_pct
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     JOIN users u    ON u.id = s.user_id
     WHERE e.section_id = ? AND e.status='enrolled'
     ORDER BY u.last_name`,
    [sectionId, sectionId]
  );
  students.forEach(s => {
    s.risk = s.attendance_pct == null ? 'unknown'
           : s.attendance_pct < 75 ? 'high'
           : s.attendance_pct < 85 ? 'medium' : 'low';
  });

  const [sessions] = await pool.query(
    `SELECT * FROM class_sessions WHERE section_id = ? ORDER BY session_date`,
    [sectionId]
  );

  const [[summary]] = await pool.query(
    `SELECT COUNT(DISTINCT e.id) AS total_students,
            ROUND(SUM(a.status IN ('present','late')) * 100.0 /
                  NULLIF(COUNT(a.id),0), 1) AS attendance_pct,
            SUM(CASE WHEN sub.pct < 75 THEN 1 ELSE 0 END) AS at_risk
     FROM enrollments e
     LEFT JOIN attendance a       ON a.student_id = e.student_id
     LEFT JOIN class_sessions cs2 ON cs2.id = a.session_id AND cs2.section_id = e.section_id
     LEFT JOIN (
       SELECT a.student_id,
              SUM(a.status IN ('present','late')) * 100.0 /
              NULLIF(COUNT(*),0) AS pct
       FROM attendance a
       JOIN class_sessions cs ON cs.id = a.session_id
       WHERE cs.section_id = ?
       GROUP BY a.student_id
     ) sub ON sub.student_id = e.student_id
     WHERE e.section_id = ? AND e.status='enrolled'`,
    [sectionId, sectionId]
  );

  await attendanceReport(res, { section: secRows[0], students, sessions, summary });
}

async function myPerformancePdf(req, res) {
  const [stuRows] = await pool.query(
    `SELECT s.id, s.student_number,
            CONCAT(u.first_name,' ',u.last_name) AS name
     FROM students s JOIN users u ON u.id = s.user_id
     WHERE s.user_id = ?`,
    [req.user.sub]
  );
  if (!stuRows[0]) throw new HttpError(404, 'Student profile not found');
  const student = stuRows[0];

  const [grades] = await pool.query(
    `SELECT gi.title, gi.category, gi.max_score, g.score
     FROM grades g
     JOIN grade_items gi ON gi.id = g.grade_item_id
     WHERE g.student_id = ?
     ORDER BY g.recorded_at DESC`,
    [student.id]
  );

  const [hist] = await pool.query(
    `SELECT a.status FROM attendance a
     WHERE a.student_id = ?`,
    [student.id]
  );
  const total = hist.length;
  const present = hist.filter(h => h.status === 'present').length;
  const late    = hist.filter(h => h.status === 'late').length;
  const absent  = hist.filter(h => h.status === 'absent').length;
  const excused = hist.filter(h => h.status === 'excused').length;

  const attendance = {
    summary: {
      total, present, late, absent, excused,
      percentage: total ? Math.round(((present + late) / total) * 100) : 0,
    },
  };
  await studentPerformanceReport(res, { student, grades, attendance });
}

module.exports = { attendancePdf, myPerformancePdf };
