import pool from "../db/pool.js"
import bcrypt from "bcrypt"
import createError from "../utils/createError.js";


async function userRegister(data) {
    const { firstName, lastName, email, password } = data;
    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const result = await pool.query(`INSERT INTO users (firstName,lastName,email,password) VALUES (?,?,?,?)`, [firstName, lastName, email, passwordHash]);
        return result.insertId;
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            throw createError("User already exist", 409);
        }
        throw error;
    }
}


async function userLogin(email) {
    const [rows] = await pool.query(`SELECT id, firstName, lastName, email, password FROM users WHERE email = ?`, [email]);
    // if no user then return the responcef 
    if (rows.length === 0) throw createError("Email or password is incorrect", 401);
    return rows[0];
}

async function getPasswordById(userId) {
    const [rows] = await pool.query(`SELECT password FROM users WHERE id=?`, [userId])
    if (rows.length === 0) throw createError("User does not exist", 404);
    return rows[0].password
}

async function deleteUserById(userId) {
    await pool.query(`DELETE FROM users WHERE id=?`, [userId])
}

export {
    userRegister, userLogin, getPasswordById, deleteUserById
}
