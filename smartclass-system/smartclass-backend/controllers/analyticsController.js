// controllers/analyticsController.js
const { pool } = require('../config/db');

// Institution-wide summary (admin)
async function institutionOverview(req, res) {
  const [[users]] = await pool.query(
    `SELECT
       SUM(role='student') AS students,
       SUM(role='teacher') AS teachers,
       SUM(role='admin')   AS admins
     FROM users WHERE status='active'`
  );
  const [[att]] = await pool.query(
    `SELECT
       ROUND(SUM(status IN ('present','late')) * 100.0 /
             NULLIF(COUNT(*),0), 1) AS pct
     FROM attendance a
     JOIN class_sessions cs ON cs.id = a.session_id
     WHERE cs.session_date >= CURDATE() - INTERVAL 7 DAY`
  );
  const [trend] = await pool.query(
    `SELECT cs.session_date AS day,
            SUM(a.status='present') AS present,
            SUM(a.status='late')    AS late,
            SUM(a.status='absent')  AS absent
     FROM attendance a
     JOIN class_sessions cs ON cs.id = a.session_id
     WHERE cs.session_date >= CURDATE() - INTERVAL 14 DAY
     GROUP BY cs.session_date ORDER BY cs.session_date`
  );
  res.json({
    users,
    attendancePct: att.pct,
    trend,
  });
}

// Section-level analytics (teacher)
async function sectionAnalytics(req, res) {
  const { sectionId } = req.params;

  const [trend] = await pool.query(
    `SELECT cs.session_date AS day,
            SUM(a.status='present') AS present,
            SUM(a.status='late')    AS late,
            SUM(a.status='absent')  AS absent,
            SUM(a.status='excused') AS excused
     FROM attendance a
     JOIN class_sessions cs ON cs.id = a.session_id
     WHERE cs.section_id = ?
     GROUP BY cs.session_date
     ORDER BY cs.session_date`,
    [sectionId]
  );

  const [perfTrend] = await pool.query(
    `SELECT DATE_FORMAT(g.recorded_at, '%Y-%u') AS week,
            ROUND(AVG((g.score / gi.max_score) * 100), 2) AS avg
     FROM grades g
     JOIN grade_items gi ON gi.id = g.grade_item_id
     WHERE gi.section_id = ?
     GROUP BY week ORDER BY week`,
    [sectionId]
  );

  const [[summary]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM enrollments
         WHERE section_id = ? AND status='enrolled') AS total_students,
       (SELECT ROUND(SUM(status IN ('present','late')) * 100.0 /
                     NULLIF(COUNT(*),0), 1)
        FROM attendance a JOIN class_sessions cs ON cs.id=a.session_id
        WHERE cs.section_id = ?) AS attendance_pct,
       (SELECT ROUND(AVG((g.score / gi.max_score) * 100), 1)
        FROM grades g JOIN grade_items gi ON gi.id = g.grade_item_id
        WHERE gi.section_id = ?) AS class_average`,
    [sectionId, sectionId, sectionId]
  );

  res.json({ summary, trend, performanceTrend: perfTrend });
}

module.exports = { institutionOverview, sectionAnalytics };
