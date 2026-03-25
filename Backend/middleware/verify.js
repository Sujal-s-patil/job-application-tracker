import { verifyToken } from "../utils/jwt.js";


function verifyUser(req, res,next) {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ status: false, message: "token not provided" })
    try {
        const result = verifyToken(token)
        req.user = result;
        next()
    } catch (error) {
        return res.status(401).json({ status: false, message: "user must be authenticated" })
    }
}

export {
    verifyUser
}