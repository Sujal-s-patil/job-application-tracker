import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY
function createToken(user) {
    return jwt.sign({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
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