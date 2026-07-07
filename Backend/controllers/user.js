import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt.js";
import createError from "../utils/createError.js"
import { setAuthCookie, clearAuthCookie } from "../utils/cookie.js"
import { userLogin, userRegister, getPasswordById, deleteUserById } from "../queries/user.js"

async function register(req, res, next) {
    try {
        await userRegister(req.validatedData)
        return res.status(201).json({ success: true, message: "user created successfully" })
    } catch (error) {
        next(error)
    }

}

async function login(req, res, next) {
    try {
        const { email, password } = req.validatedData
        const result = await userLogin(email)

        // matching the password with the hashvalue of the password
        const isMatch = await bcrypt.compare(password, result.password)

        // if password does not match return responce 
        if (!isMatch) throw createError("Email or password is incorrect", 401)

        // create token for the user for further requests
        const token = createToken(result)
        setAuthCookie(res, token)
        delete result.password


        return res.status(200).json({ success: true, message: "login successful", userInfo: result })
    } catch (error) {
        next(error)
    }
}

async function logout(req, res) {
    clearAuthCookie(res)
    res.status(200).json({ success: true, message: "logout successfully" })
}

async function deleteUser(req, res, next) {
    try {
        const password = req.validatedData.password;
        const userId = req.user.id

        const storedPassword = await getPasswordById(userId)
        const verify = await bcrypt.compare(password, storedPassword);
        if (!verify) throw createError("Password is wrong", 401);

        await deleteUserById(userId)
        clearAuthCookie(res)
        return res.status(200).json({ success: true, message: "user deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export {
    register, login, logout, deleteUser
}