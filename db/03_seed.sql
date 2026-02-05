-- 1. Insertar Estudiantes
INSERT INTO students (name, email, program, enrollment_year) VALUES
                                                                 ('Ana García', 'ana.garcia@university.edu', 'Ingeniería de Software', 2022),
                                                                 ('Carlos Méndez', 'carlos.mendez@university.edu', 'Arquitectura', 2023),
                                                                 ('Elena Torres', 'elena.torres@university.edu', 'Ingeniería de Software', 2021),
                                                                 ('Luis Ramírez', 'luis.ramirez@university.edu', 'Administración', 2024),
                                                                 ('Sofia López', 'sofia.lopez@university.edu', 'Derecho', 2023);

-- 2. Insertar Cursos
INSERT INTO courses (code, name, credits) VALUES
                                              ('CS101', 'Introducción a la Programación', 4),
                                              ('MATH20', 'Cálculo Diferencial', 5),
                                              ('HIS100', 'Historia Universal', 3),
                                              ('ART50', 'Teoría del Color', 3);

-- 3. Insertar Grupos (Depende de courses)
-- Nota: Asumimos los IDs generados por el SERIAL: 1=Progra, 2=Cálculo, 3=Historia
INSERT INTO groups (course_id, term) VALUES
                                         (1, '2024-1'), -- Grupo 1 de Programación
                                         (1, '2024-2'), -- Grupo 2 de Programación (otro periodo)
                                         (2, '2024-1'), -- Grupo 1 de Cálculo
                                         (3, '2024-1'); -- Grupo 1 de Historia

-- 4. Insertar Inscripciones (Depende de students y groups)
-- Estudiantes inscribiéndose en grupos específicos
INSERT INTO enrollments (student_id, group_id, enrolled_at) VALUES
                                                                (1, 1, '2024-01-15 09:00:00'), -- Ana en Programación G1
                                                                (1, 3, '2024-01-15 09:05:00'), -- Ana en Cálculo G1
                                                                (2, 4, '2024-01-16 10:00:00'), -- Carlos en Historia G1
                                                                (3, 1, '2024-01-15 11:30:00'), -- Elena en Programación G1
                                                                (4, 3, '2024-01-20 14:00:00'); -- Luis en Cálculo G1

-- 5. Insertar Calificaciones (Depende de enrollments)
-- Las notas son sobre 10.00
INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
                                                                  (1, 8.50, 9.00, 8.75), -- Notas de Ana en Progra
                                                                  (2, 7.00, 6.50, 6.80), -- Notas de Ana en Cálculo
                                                                  (3, 9.50, 9.80, 9.70), -- Notas de Carlos en Historia
                                                                  (4, 5.00, 6.00, 5.50), -- Notas de Elena en Progra (Bajas)
                                                                  (5, NULL, NULL, NULL); -- Luis aún no tiene notas (curso empezando)

-- 6. Insertar Asistencia (Depende de enrollments)
INSERT INTO attendance (enrollment_id, date, present) VALUES
-- Asistencia para Ana en Progra (Enrollment ID 1)
(1, '2024-02-01', TRUE),
(1, '2024-02-03', TRUE),
(1, '2024-02-05', FALSE), -- Faltó
-- Asistencia para Elena en Progra (Enrollment ID 4)
(4, '2024-02-01', TRUE),
(4, '2024-02-03', FALSE),
-- Asistencia para Carlos en Historia (Enrollment ID 2)
(2, '2024-02-02', TRUE);