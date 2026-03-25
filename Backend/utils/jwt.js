import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;

function createToken({ id, firstName, lastName, email }) {
    return jwt.sign({
        id,
        firstName,
        lastName,
        email
    }, secretKey, {
        expiresIn: "24h"
    })
}

function verifyToken(token) {
    return jwt.verify(token, secretKey)
}


export {
    createToken, verifyToken
}