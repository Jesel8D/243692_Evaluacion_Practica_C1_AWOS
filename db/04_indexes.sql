-- Índices para optimizar búsquedas y joins

-- 1. Búsqueda de alumnos (usado en filtro de búsqueda)
CREATE INDEX idx_students_search ON students(name, email);

-- 2. Filtros por programa (usado en Ranking)
CREATE INDEX idx_students_program ON students(program);

-- 3. Optimización de Joins principales
CREATE INDEX idx_groups_teacher ON groups(teacher_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_group ON enrollments(group_id);
CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);
CREATE INDEX idx_attendance_enrollment ON attendance(enrollment_id);