// controllers/gradeController.js
const { pool } = require('../config/db');
const { HttpError } = require('../middleware/error');

async function listItems(req, res) {
  const { sectionId } = req.query;
  const [rows] = await pool.query(
    `SELECT * FROM grade_items WHERE section_id = ? ORDER BY created_at DESC`,
    [sectionId]
  );
  res.json({ items: rows });
}

async function createItem(req, res) {
  const { sectionId, title, category, maxScore, weight, dueDate } = req.body;
  const [r] = await pool.query(
    `INSERT INTO grade_items
       (section_id, title, category, max_score, weight, due_date)
     VALUES (?,?,?,?,?,?)`,
    [sectionId, title, category, maxScore, weight || 1.0, dueDate || null]
  );
  res.status(201).json({ id: r.insertId });
}

async function recordGrade(req, res) {
  const { gradeItemId, studentId, score, remarks } = req.body;
  await pool.query(
    `INSERT INTO grades (grade_item_id, student_id, score, remarks, recorded_by)
     VALUES (?,?,?,?,?)
     ON DUPLICATE KEY UPDATE score=VALUES(score), remarks=VALUES(remarks),
                             recorded_by=VALUES(recorded_by), recorded_at=NOW()`,
    [gradeItemId, studentId, score, remarks || null, req.user.sub]
  );

  // Notify student
  const [stu] = await pool.query(
    'SELECT user_id FROM students WHERE id = ?', [studentId]
  );
  const [item] = await pool.query(
    'SELECT title FROM grade_items WHERE id = ?', [gradeItemId]
  );
  if (stu[0] && item[0]) {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body)
       VALUES (?,?,?,?)`,
      [stu[0].user_id, 'grade', 'Grade posted',
       `${item[0].title}: ${score}`]
    );
  }
  res.json({ ok: true });
}

// Student's own grades across all sections
async function myGrades(req, res) {
  const [rows] = await pool.query(
    `SELECT g.score, g.recorded_at,
            gi.title, gi.category, gi.max_score, gi.weight,
            sec.code AS section_code, sec.subject
     FROM grades g
     JOIN grade_items gi ON gi.id = g.grade_item_id
     JOIN sections sec   ON sec.id = gi.section_id
     JOIN students s     ON s.id = g.student_id
     WHERE s.user_id = ?
     ORDER BY g.recorded_at DESC`,
    [req.user.sub]
  );
  res.json({ grades: rows });
}

// Class roster with computed averages
async function classRoster(req, res) {
  const { sectionId } = req.params;
  const [rows] = await pool.query(
    `SELECT s.id, s.student_number,
            CONCAT(u.first_name,' ',u.last_name) AS name,
            ROUND(AVG((g.score / gi.max_score) * 100 * gi.weight) /
                  AVG(gi.weight), 2) AS average,
            (SELECT ROUND(
                      SUM(CASE WHEN a.status IN ('present','late')
                               THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*),0), 1)
             FROM attendance a
             JOIN class_sessions cs ON cs.id = a.session_id
             WHERE cs.section_id = ? AND a.student_id = s.id
            ) AS attendance_pct
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     JOIN users u    ON u.id = s.user_id
     LEFT JOIN grades g     ON g.student_id = s.id
     LEFT JOIN grade_items gi ON gi.id = g.grade_item_id
                              AND gi.section_id = e.section_id
     WHERE e.section_id = ? AND e.status='enrolled'
     GROUP BY s.id, s.student_number, u.first_name, u.last_name
     ORDER BY u.last_name`,
    [sectionId, sectionId]
  );

  // Risk classification
  const roster = rows.map(r => ({
    ...r,
    risk: r.attendance_pct == null ? 'unknown'
          : r.attendance_pct < 75 || (r.average != null && r.average < 70) ? 'high'
          : r.attendance_pct < 85 || (r.average != null && r.average < 78) ? 'medium'
          : 'low',
  }));

  res.json({ roster });
}

module.exports = {
  listItems, createItem, recordGrade, myGrades, classRoster,
};
