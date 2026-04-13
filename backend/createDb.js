import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function createDb() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // connect to default
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'crs'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE crs');
      console.log("✅ Database 'crs' created successfully.");
    } else {
      console.log("✅ Database 'crs' already exists.");
    }
  } catch (err) {
    console.error("Failed to create database:", err.message);
  } finally {
    await client.end();
  }
}

createDb();
