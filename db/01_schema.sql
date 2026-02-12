DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Esta tabla contiene los datos de los alumnos
CREATE TABLE students (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          email VARCHAR(100) UNIQUE NOT NULL,
                          program VARCHAR(50) NOT NULL,
                          enrollment_year INT NOT NULL
);

--Datos de los profesores
CREATE TABLE teachers (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          email VARCHAR(100) UNIQUE NOT NULL
);

--Catalogo de materias
CREATE TABLE courses (
                         id SERIAL PRIMARY KEY,
                         code VARCHAR(20) UNIQUE NOT NULL,
                         name VARCHAR(100) NOT NULL,
                         credits INT NOT NULL
);
--Grupos especificos de un curso
CREATE TABLE groups (
                        id SERIAL PRIMARY KEY,
                        course_id INT REFERENCES courses(id),
                        teacher_id INT REFERENCES teachers(id), -- Agregado según rúbrica
                        term VARCHAR(20) NOT NULL
);
--Inscripciones (la relacion entre estudiante y grupo)
CREATE TABLE enrollments (
                             id SERIAL PRIMARY KEY,
                             student_id INT REFERENCES students(id),
                             group_id INT REFERENCES groups(id),
                             enrolled_at TIMESTAMP DEFAULT NOW()
);
--Calificaciones (parcial 1, parcial 2 y calificacion final )
CREATE TABLE grades (
                        id SERIAL PRIMARY KEY,
                        enrollment_id INT REFERENCES enrollments(id),
                        partial1 DECIMAL(4,2),
                        partial2 DECIMAL(4,2),
                        final DECIMAL(4,2)
);
--Asistencias por fecha
CREATE TABLE attendance (
                            id SERIAL PRIMARY KEY,
                            enrollment_id INT REFERENCES enrollments(id),
                            date DATE NOT NULL,
                            present BOOLEAN DEFAULT FALSE
);

--En este planteamiento cada grupo pertenece a un curso y un profesor
--cada inscripcion conecta a un estudiante con un grupo
--calificaciones y asistencias se registran por inscripcion