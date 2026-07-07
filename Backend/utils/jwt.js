import jwt from "jsonwebtoken";
import config from "../config/env.js"

function createToken({ id, email }) {
    return jwt.sign({
        id,
        email
    }, config.SECRET_KEY, {
        expiresIn: "24h"
    })
}

function verifyToken(token) {
    return jwt.verify(token, config.SECRET_KEY, { algorithms: ["HS256"] })
}


export {
    createToken, verifyToken
}