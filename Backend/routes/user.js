import express from "express";
import { register, login } from "../controllers/user.js"
import { loginSchema, registerSchema } from "../schemas/userSchema.js"
import validate from "../middleware/validation.js"
const userRoute = express.Router();

userRoute.post("/register", validate(registerSchema), register)
userRoute.post("/login", validate(loginSchema), login)


export default userRoute;