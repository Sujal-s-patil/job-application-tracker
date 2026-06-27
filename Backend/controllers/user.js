import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";
import { createToken } from "../utils/jwt.js";
import config from "../config/env.js"
import { createError } from "../utils/createError.js"


async function register(req, res, next) {
    try {
        const { firstName, lastName, email, password } = req.validatedData;
        // hashing the password
        const passwordHash = await bcrypt.hash(password, 12);
        const values = [firstName, lastName, email, passwordHash]
        const createUser = `INSERT INTO users (firstName,lastName,email,password) VALUES (?,?,?,?)`
        // console.log(error)
        // if get error that means user already exist
        // return res.status(409).json({ success: false, message: "user already exist" })
        await pool.query(createUser, values);
        return res.status(201).json({ success: true, message: "user created successfully" })
    } catch (error) {
        next(error)
    }

}

async function login(req, res, next) {
    try {
        const { email, password } = req.validatedData;
        const query = `SELECT id, firstName, lastName, email, password FROM users WHERE email = ?`;
        // query to check if the email exist
        const [rows] = await pool.query(query, [email])

        // if no user then return the responcef 
        if (rows.length === 0) throw createError("Email or password is incorrect", 401)

        // matching the password with the hashvalue of the password
        const isMatch = await bcrypt.compare(password, rows[0].password)

        // if password does not match return responce 
        if (!isMatch) throw createError("Email or password is incorrect", 401)

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
        next(error)
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

async function deleteUser(req, res, next) {
    try {
        const password = req.validatedData.password;
        const userId = req.user.id
        const [rows] = await pool.query("select password from users where id=?", [userId])
        if (rows.length === 0) throw createError("User does not exist", 404)
        const verify = await bcrypt.compare(password, rows[0].password);
        if (verify) {
            await pool.query('delete from users where id=?', [userId])
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                secure: config.NODE_ENV === "production",
                path: "/"
            })
            return res.status(200).json({ success: true, message: "user deleted successfully" })
        }
        throw createError("Password is wrong", 401)
    } catch (error) {
        next(error)
    }
}

export {
    register, login, logout, deleteUser
}