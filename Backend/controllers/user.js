import bcrypt from "bcrypt";
import {db} from "../db/sql.js";
async function register(req, res) {
    const query = `SELECT email from users where user=?`;
    db.query(query, req.email, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).end({ error: "server side error" })
        }
console.log(result)
    })

    return res.end("register")
}

async function login(req, res) {
    return res.end("login")

}

export {
    register, login
}