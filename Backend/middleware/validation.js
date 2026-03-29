import { loginSchema, registerSchema } from "../schemas/userSchema.js"
import { applicationSchema } from "../schemas/applicationSchema.js"


function validateUser(req, res, next) {
    let parsedData;
    if (req.url === '/register') {
        parsedData = registerSchema.safeParse(req.body);
    }

    if (req.url === '/login') {
        parsedData = loginSchema.safeParse(req.body);
    }

    if (parsedData.success) {
        req.body = parsedData.data;
    } else {
        return res.status(400).json({
            status: false, message: parsedData.error.message
        })
    }
    next()
}


function validateApplication(req, res, next) {

}
export {
    validateUser,
    validateApplication
}