import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(text: string, params?: any[]) {
    try {
        return await pool.query(text, params);
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

/* 1. VIEW: vw_students_at_risk*/
export async function getStudentsAtRisk(
    search?: string,
    page: number = 1,
    limit: number = 10
) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM vw_students_at_risk`;
    const params: any[] = [];

    if (search) {
        sql += ` WHERE student_name ILIKE $1 OR email ILIKE $1`;
        params.push(`%${search}%`);
    }

    const pLimit = params.length + 1;
    const pOffset = params.length + 2;

    sql += ` ORDER BY avg_grade ASC LIMIT $${pLimit} OFFSET $${pOffset}`;
    params.push(limit, offset);

    const res = await query(sql, params);
    return res.rows;
}

/* 2. VIEW: vw_teacher_load */
export async function getTeacherLoad(
    search?: string,
    page: number = 1,
    limit: number = 10
) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM vw_teacher_load`;
    const params: any[] = [];

    if (search) {
        sql += ` WHERE teacher_name ILIKE $1`;
        params.push(`%${search}%`);
    }

    const pLimit = params.length + 1;
    const pOffset = params.length + 2;

    sql += ` ORDER BY total_students DESC LIMIT $${pLimit} OFFSET $${pOffset}`;
    params.push(limit, offset);

    const res = await query(sql, params);
    return res.rows;
}

/* 3. VIEW: vw_course_performance */
export async function getCoursePerformance(term?: string) {
    let sql = `SELECT * FROM vw_course_performance`;
    const params: any[] = [];

    if (term) {
        sql += ` WHERE term = $1`;
        params.push(term);
    }

    sql += ` ORDER BY failed_count DESC, average_grade ASC`;

    const res = await query(sql, params);
    return res.rows;
}

/* 4. VIEW: vw_attendance_by_group */
export async function getAttendanceByGroup() {
    const sql = `
        SELECT * FROM vw_attendance_by_group
        ORDER BY group_attendance_pct ASC
            LIMIT 50
    `;
    const res = await query(sql);
    return res.rows;
}

/*5. VIEW: vw_rank_students*/
export async function getStudentRank(program?: string) {
    let sql = `SELECT * FROM vw_rank_students`;
    const params: any[] = [];

    if (program && program !== 'all') {
        sql += ` WHERE program = $1`;
        params.push(program);
    }

    sql += ` ORDER BY program, rank_in_program ASC LIMIT 100`;

    const res = await query(sql, params);
    return res.rows;
}


// Periodos disponibles (Course Performance)
export async function getTerms() {
    const sql = `
        SELECT DISTINCT term
        FROM vw_course_performance
        ORDER BY term DESC
    `;
    const res = await query(sql);
    return res.rows;
}

// Programas disponibles (Student Ranking)
export async function getPrograms() {
    const sql = `
        SELECT DISTINCT program
        FROM vw_rank_students
        ORDER BY program ASC
    `;
    const res = await query(sql);
    return res.rows;
}
