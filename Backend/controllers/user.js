import bcrypt from "bcrypt";
import { db } from "../db/sql.js";
import { createToken } from "../utils/jwt.js";

async function register(req, res) {
    if (!req.body) {
        return res.status(400).json({ error: "body not present" })
    }
    const checkUser = `SELECT email from users where email=?`;
    db.query(checkUser, req.body.email, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: "server side error" })
        }
        if (result.length === 0) {
            bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
                const values = [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]
                const createUser = `INSERT INTO users (firstName,lastName,email,password) VALUES (?,?,?,?)`
                db.query(createUser, values, ((error, result) => {
                    if (error) {
                        console.log(error)
                    }
                    if (result) {
                        return res.status(201).json({ msg: "User created successfully" })
                    }
                }))
            })
        } else {
            return res.status(409).json({
                error: "email id already exist"
            })
        }
    })

}

async function login(req, res) {
    if (!req.body) {
        return res.status(400).json({
            error: "body not present"
        })
    }
    const checkuser = `SELECT * FROM users WHERE email=?;`;
    db.query(checkuser, req.body.email, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: "Internal server error"
            })
        }
        if (result.length === 0) {
            return res.status(400).json({
                error: "email or password is wrong"
            })
        }
        bcrypt.compare(req.body.password, result[0].password).then((isMatch) => {
            if (isMatch) {
                const token = createToken(result[0]);
                res.cookie("token",token);
                return res.status(200).json({
                    msg: "success"
                })
            } else {
                return res.status(400).json({
                    error: "email or password is wrong"
                })
            }
        })

    })

}

export {
    register, login
}