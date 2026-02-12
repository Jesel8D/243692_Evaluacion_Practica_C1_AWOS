-- 1. Seguridad: Revocar permisos sobre las tablas base
-- (Esto evita que el usuario 'app_user' vea los datos crudos)
REVOKE ALL ON students, teachers, courses, groups, enrollments, grades, attendance FROM app_user;

-- 2. Accesibilidad: Otorgar permisos SOLO de lectura sobre las vistas
-- Vistas Originales
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_attendance_by_group TO app_user;
GRANT SELECT ON vw_rank_students TO app_user;

-- Vistas Nuevas (KPIs)
GRANT SELECT ON vw_kpi_attendance TO app_user;
GRANT SELECT ON vw_kpi_students_risk_summary TO app_user;
GRANT SELECT ON vw_kpi_course_overview TO app_user;