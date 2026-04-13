import pool from './db.js';
import bcrypt from 'bcryptjs';

async function setup() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'student'
            );
            CREATE TABLE IF NOT EXISTS complaints (
                id SERIAL PRIMARY KEY,
                complaint_id VARCHAR(50) NOT NULL UNIQUE,
                student_id INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tables created successfully!');

        const res = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@crs.com']);
        if (res.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                ['System Admin', 'admin@crs.com', hashedPassword, 'admin']
            );
            console.log('Default admin created: admin@crs.com / admin123');
        }
    } catch (err) {
        console.error('Database setup failed:', err);
    } finally {
        pool.end();
    }
}
setup();
