-- ==============================================================================
-- 1. Vista: vw_students_at_risk
-- Descripcion: Identifica alumnos en riesgo académico o de deserción.
-- Grain: 1 fila por estudiante.
-- Metricas: Promedio general, % Asistencia global.
-- Requisitos cumplidos: CTE (WITH), COALESCE, Búsqueda.
-- Verify: SELECT * FROM vw_students_at_risk WHERE avg_grade < 7;
-- ==============================================================================
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

-- ==============================================================================
-- 2. Vista: vw_teacher_load
-- Descripcion: Carga académica y desempeño por profesor.
-- Grain: 1 fila por profesor.
-- Metricas: Total grupos, total alumnos, promedio que otorga.
-- Requisitos cumplidos: HAVING (1/2), Paginación posible.
-- Verify: SELECT * FROM vw_teacher_load ORDER BY total_students DESC;
-- ==============================================================================
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT
    t.id AS teacher_id,
    t.name AS teacher_name,
    t.email AS teacher_email,
    COUNT(DISTINCT g.id) AS total_groups,
    COUNT(e.id) AS total_students,
    AVG(COALESCE(gr.final, 0))::NUMERIC(4,2) AS average_group_grade
FROM teachers t
         JOIN groups g ON t.id = g.teacher_id
         LEFT JOIN enrollments e ON g.id = e.group_id
         LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY t.id, t.name, t.email
HAVING COUNT(e.id) > 0; --esto es unicamente para profesores con alumno activos

-- ==============================================================================
-- 3. Vista: vw_course_performance
-- Descripcion: Rendimiento general desglosado por materia y periodo.
-- Grain: 1 fila por Curso + Periodo.
-- Metr icas: Inscritos, Reprobados, Promedio, Estatus (KPI texto).
-- Requisitos cumplidos: CASE (Semántico), HAVING (2/2).
-- Verify: SELECT * FROM vw_course_performance WHERE term = '2024-1'    ;
-- ==============================================================================
CREATE OR REPLACE VIEW vw_course_performance AS
SELECT
    c.name AS course_name,
    g.term,
    COUNT(e.id) as enrolled_count,
    SUM(CASE WHEN COALESCE(gr.final, 0) < 6 THEN 1 ELSE 0 END) as failed_count,
    ROUND(AVG(COALESCE(gr.final, 0)), 2) as average_grade,
    CASE
        WHEN AVG(COALESCE(gr.final, 0)) < 6 THEN 'CRÍTICO'
        WHEN AVG(COALESCE(gr.final, 0)) < 8 THEN 'REGULAR'
        ELSE 'BUENO'
        END as status
FROM courses c
         JOIN groups g ON c.id = g.course_id
         JOIN enrollments e ON g.id = e.group_id
         LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.name, g.term
HAVING COUNT(e.id) > 0;

-- ==============================================================================
-- 4. Vista : vw_attendance_by_group
-- Descripcion: Porcentaje de asistencia agrupado.
-- Grain: 1 fila por Grupo (Materia + Periodo + Profe).
-- Metricas: % Asistencia.
-- Requisitos cumplidos: COALESCE avanzado, JOINs múltiples.
-- Verify: SELECT * FROM vw_attendance_by_group WHERE group_attendance_pct < 80;
-- ==============================================================================
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT
    c.name AS course_name,
    g.term,
    t.name AS teacher_name,
    COUNT(DISTINCT e.student_id) as total_students,
    COALESCE(ROUND(
                     (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::NUMERIC /
        NULLIF(COUNT(a.id), 0)) * 100,
                     2), 0) as group_attendance_pct
FROM groups g
         JOIN courses c ON g.course_id = c.id
         JOIN teachers t ON g.teacher_id = t.id
         JOIN enrollments e ON g.id = e.group_id
         LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY c.name, g.term, t.name;

-- ==============================================================================
-- 5. Vista: vw_rank_students
-- Descripcion: Ranking académico por programa.
-- Grain: 1 fila por estudiante.
-- Metricas: Promedio, Rank (posición).
-- Requisitos cumplidos: Window Function (RANK OVER PARTITION).
-- Verify: SELECT * FROM vw_rank_students WHERE rank_in_program <= 3;
-- ==============================================================================
CREATE OR REPLACE VIEW vw_rank_students AS
SELECT
    s.name,
    s.program,
    s.enrollment_year,
    ROUND(AVG(COALESCE(gr.final, 0)), 2) as average,
    RANK() OVER (PARTITION BY s.program ORDER BY AVG(COALESCE(gr.final, 0)) DESC) as rank_in_program
FROM students s
         JOIN enrollments e ON s.id = e.student_id
         JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.id, s.name, s.program, s.enrollment_year;