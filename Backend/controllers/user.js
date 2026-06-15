import bcrypt from "bcrypt";
import { pool } from "../db/sql.js";
import { createToken } from "../utils/jwt.js";
import config from "../config/env.js"

async function register(req, res) {
    try {
        const { firstName, lastName, email, password } = req.validatedData;
        // hashing the password
        const passwordHash = await bcrypt.hash(password, 12);
        const values = [firstName, lastName, email, passwordHash]
        const createUser = `INSERT INTO users (firstName,lastName,email,password) VALUES (?,?,?,?)`
        await pool.query(createUser, values);
        return res.status(201).json({ success: true, message: "user created successfully" })
    } catch (error) {
        console.log(error)
        // if get error that means user already exist
        return res.status(409).json({ success: false, message: "user already exist" })
    }

}

async function login(req, res) {
    try {
        const { email, password } = req.validatedData;
        const query = `SELECT id, firstName, lastName, email, password FROM users WHERE email = ?`;
        // query to check if the email exist
        const [rows] = await pool.query(query, [email])

        // if no user then return the responcef 
        if (rows.length === 0) return res.status(401).json({ success: false, message: "email or password is incorrect" })

        // matching the password with the hashvalue of the password
        const isMatch = await bcrypt.compare(password, rows[0].password)

        // if password does not match return responce 
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "email or password is incorrect" })
        }

        // create token for the user for further requests
        const token = createToken(rows[0])
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            secure: config.NODE_ENV === "production",
            path: "/"
        })
        const payload = { userId: rows[0].id, firstName: rows[0].firstName, lastName: rows[0].lastName, email: rows[0].email }
        return res.status(200).json({ success: true, message: "login successful", userInfo: payload })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}

async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        secure: config.NODE_ENV === "production",
        path: "/"
    })
    res.status(200).json({ success: true, message: "logout successfully" })
}

async function deleteUser(req, res) {
    try {
        const password = req.validatedData.password;
        const userId = req.user.id
        const [rows] = await pool.query("select password from users where id=?", [userId])
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "user does not exist" })
        }
        const verify = await bcrypt.compare(password, rows[0].password);
        if (verify) {
            await pool.query('delete from users where id=?', [userId])
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                secure: config.NODE_ENV === "production"
            })
            return res.status(200).json({ success: true, message: "user deleted successfully" })
        }
        return res.status(401).json({ success: false, message: "wrong password" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}

export {
    register, login, logout, deleteUser
}