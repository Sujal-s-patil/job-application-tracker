import mysql from "mysql2";
import config from "../config/env.js"

const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: config.DB_CONNECTION_LIMIT,
    queueLimit: 0
}).promise()

export default pool