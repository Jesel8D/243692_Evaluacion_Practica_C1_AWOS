-- 1. Insertar Profesores
INSERT INTO teachers (name, email) VALUES
                                       ('Dr. Alan Turing', 'alan@university.edu'),
                                       ('Mtra. Ada Lovelace', 'ada@university.edu'),
                                       ('Prof. Richard Feynman', 'richard@university.edu');

-- 2. Insertar Estudiantes
INSERT INTO students (name, email, program, enrollment_year) VALUES
                                                                 ('Ana García', 'ana.garcia@university.edu', 'Ingeniería de Software', 2022),
                                                                 ('Carlos Méndez', 'carlos.mendez@university.edu', 'Arquitectura', 2023),
                                                                 ('Elena Torres', 'elena.torres@university.edu', 'Ingeniería de Software', 2021),
                                                                 ('Luis Ramírez', 'luis.ramirez@university.edu', 'Administración', 2024),
                                                                 ('Sofia López', 'sofia.lopez@university.edu', 'Derecho', 2023);

-- 3. Insertar Cursos
INSERT INTO courses (code, name, credits) VALUES
                                              ('CS101', 'Introducción a la Programación', 4),
                                              ('MATH20', 'Cálculo Diferencial', 5),
                                              ('HIS100', 'Historia Universal', 3),
                                              ('ART50', 'Teoría del Color', 3);

-- 4. Insertar Grupos
INSERT INTO groups (course_id, teacher_id, term) VALUES
                                                     (1, 1, '2024-1'), -- Progra / Turing
                                                     (1, 1, '2024-2'), -- Progra / Turing
                                                     (2, 2, '2024-1'), -- Cálculo / Ada
                                                     (3, 3, '2024-1'); -- Historia / Feynman

-- 5. Insertar Inscripciones
INSERT INTO enrollments (student_id, group_id, enrolled_at) VALUES
                                                                (1, 1, '2024-01-15 09:00:00'),
                                                                (1, 3, '2024-01-15 09:05:00'),
                                                                (2, 4, '2024-01-16 10:00:00'),
                                                                (3, 1, '2024-01-15 11:30:00'),
                                                                (4, 3, '2024-01-20 14:00:00');

-- 6. Insertar Calificaciones
INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
                                                                  (1, 8.50, 9.00, 8.75),
                                                                  (2, 7.00, 6.50, 6.80),
                                                                  (3, 9.50, 9.80, 9.70),
                                                                  (4, 5.00, 6.00, 5.50),
                                                                  (5, NULL, NULL, NULL);

-- 7. Insertar Asistencia
INSERT INTO attendance (enrollment_id, date, present) VALUES
                                                          (1, '2024-02-01', TRUE),
                                                          (1, '2024-02-03', TRUE),
                                                          (1, '2024-02-05', FALSE),
                                                          (4, '2024-02-01', TRUE),
                                                          (4, '2024-02-03', FALSE),
                                                          (2, '2024-02-02', TRUE);