import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(text: string, params?: any[]) {
    try {
        return await pool.query(text, params);
    } catch (error) {
        throw error; //error para poder ver que falló
    }
}

export async function getStudentsAtRisk(search?: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM vw_students_at_risk`;
    const params: any[] = [];

    if (search) {
        sql += ` WHERE student_name ILIKE $1 OR email ILIKE $1`;
        params.push(`%${search}%`);
    }

    sql += ` ORDER BY avg_grade ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const res = await query(sql, params);
    return res.rows;
}