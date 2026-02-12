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

export async function getAttendanceDashboard() {
    const [kpiRes, listRes] = await Promise.all([
        query(`SELECT * FROM vw_kpi_attendance`),
        query(`SELECT * FROM vw_attendance_by_group ORDER BY group_attendance_pct ASC LIMIT 50`)
    ]);

    return {
        kpi: kpiRes.rows[0],
        groups: listRes.rows
    };
}

export async function getStudentsAtRisk(
    search?: string,
    page: number = 1,
    limit: number = 10
) {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let whereClause = '';

    if (search) {
        whereClause = ` WHERE student_name ILIKE $1 OR email ILIKE $1`;
        params.push(`%${search}%`);
    }

    const sqlData = `
        SELECT * FROM vw_students_at_risk
        ${whereClause}
        ORDER BY avg_grade ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const sqlStats = `
        SELECT 
            COUNT(*) as total_count,
            COALESCE(AVG(avg_grade), 0)::NUMERIC(4,1) as avg_grade_global
        FROM vw_students_at_risk
        ${whereClause}
    `;

    const [dataRes, statsRes] = await Promise.all([
        query(sqlData, [...params, limit, offset]),
        query(sqlStats, params)
    ]);

    return {
        students: dataRes.rows,
        meta: {
            total: Number(statsRes.rows[0]?.total_count || 0),
            avgGrade: statsRes.rows[0]?.avg_grade_global || 0,
            page,
            limit
        }
    };
}

export async function getTeacherLoad(
    search?: string,
    page: number = 1,
    limit: number = 10
) {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let whereClause = '';

    if (search) {
        whereClause = ` WHERE teacher_name ILIKE $1`;
        params.push(`%${search}%`);
    }

    const sql = `
        SELECT * FROM vw_teacher_load
        ${whereClause}
        ORDER BY total_students DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const res = await query(sql, [...params, limit, offset]);
    return res.rows;
}

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

export async function getTerms() {
    const res = await query(`SELECT DISTINCT term FROM vw_course_performance ORDER BY term DESC`);
    return res.rows;
}

export async function getPrograms() {
    const res = await query(`SELECT DISTINCT program FROM vw_rank_students ORDER BY program ASC`);
    return res.rows;
}