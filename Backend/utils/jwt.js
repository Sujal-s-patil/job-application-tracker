import jwt from "jsonwebtoken";
import config from "../config/env"

function createToken({ id, email }) {
    return jwt.sign({
        id,
        email
    }, config.SECRET_KEY, {
        expiresIn: "24h"
    })
}

function verifyToken(token) {
    return jwt.verify(token, secretKey, { algorithms: ["HS256"] })
}


export {
    createToken, verifyToken
}