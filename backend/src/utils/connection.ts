import mysql from 'mysql2/promise';
import { config } from "dotenv";

const envFile = process.env.ENV === "test" ? ".env.test" : ".env";
config({ path: envFile });

export const db = await mysql.createConnection({
    host    : process.env.DB_HOST || 'localhost',
    user    : process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test_infokes'
})