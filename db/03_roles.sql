-- Aquí solo definimos que puede ver.

-- 1. Seguridad: Revocar permisos sobre las tablas base (para que no pueda ver datos crudos)
REVOKE ALL ON students, teachers, courses, groups, enrollments, grades, attendance FROM app_user;

-- 2. Accesibilidad: Otorgar permisos SOLO de lectura sobre las vistas
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_attendance_by_group TO app_user;
GRANT SELECT ON vw_rank_students TO app_user;