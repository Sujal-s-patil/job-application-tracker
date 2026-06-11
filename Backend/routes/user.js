import express from "express";
import { register, login, logout, deleteUser } from "../controllers/user.js"
import { loginSchema, registerSchema } from "../schemas/userSchema.js"
import validate from "../middleware/validation.js"
import { verifyUser } from "../middleware/verify.js"
const userRoute = express.Router();

userRoute.post("/register", validate(registerSchema), register)
userRoute.post("/login", validate(loginSchema), login)
userRoute.get("/logout", logout)
userRoute.get("/verify", verifyUser, (req, res) => {
	return res.status(200).json({ success: true, message: "user verified" })
})
userRoute.delete("/delete", validate(loginSchema), verifyUser, deleteUser)


export default userRoute;