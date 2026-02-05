CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH student_stats AS (
    SELECT
        s.id AS student_id,
        s.name AS student_name,
        s.email,
        s.program,
        AVG(COALESCE(g.final, (g.partial1 + g.partial2)/2, 0))::NUMERIC(4,2) as avg_grade,
        (COUNT(CASE WHEN a.present THEN 1 END) * 100.0 / NULLIF(COUNT(a.id), 0))::NUMERIC(5,2) as attendance_pct
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades g ON e.id = g.enrollment_id
    LEFT JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY s.id, s.name, s.email, s.program
)
SELECT * FROM student_stats
WHERE avg_grade < 7.0 OR attendance_pct < 75.0;