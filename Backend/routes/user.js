import express from "express";
import { register, login, logout, deleteUser } from "../controllers/user.js"
import { loginSchema, registerSchema, deleteAccountSchema } from "../schemas/userSchema.js"
import validate from "../middleware/validation.js"
import { verifyUser } from "../middleware/verify.js"
import { authLimiter } from "../middleware/rateLimiter.js"

const userRoute = express.Router();

userRoute.post("/register", authLimiter, validate(registerSchema), register)
userRoute.post("/login", authLimiter, validate(loginSchema), login)
userRoute.post("/logout", logout)
userRoute.delete("/me", verifyUser, validate(deleteAccountSchema), deleteUser)
userRoute.get("/me", verifyUser, (req, res) => {
	return res.status(200).json({ success: true, message: "user verified" })
})


export default userRoute;