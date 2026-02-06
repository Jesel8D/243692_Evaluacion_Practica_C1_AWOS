-- Crea un usuario específico para la aplicación con permisos limitados

DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'app_user') THEN
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password_123';
END IF;
END
$do$;

-- Revocar permisos sobre las tablas base (Seguridad)
REVOKE ALL ON students, teachers, courses, groups, enrollments, grades, attendance FROM app_user;

-- Otorgar permisos SOLO de lectura sobre las vistas
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_attendance_by_group TO app_user;
GRANT SELECT ON vw_rank_students TO app_user;