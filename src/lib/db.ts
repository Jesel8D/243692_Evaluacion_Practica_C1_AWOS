import { Pool } from 'pg';

const globalForPool = global as unknown as { pool: Pool };

export const pool = globalForPool.pool || new Pool({
    connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool;
export async function query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log('executed query', { text, duration, rows: res.rowCount });

    return res;
}