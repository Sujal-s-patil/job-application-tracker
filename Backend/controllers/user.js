import bcrypt from "bcrypt";
import { pool } from "../db/sql.js";
import { createToken } from "../utils/jwt.js";

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
            sameSite: "strict"
        })
        return res.status(200).json({ success: true, message: "login successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}

export {
    register, login
}