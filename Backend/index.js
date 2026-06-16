import config from "./config/env.js"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet"
const app = express();

//importing  routes
import userRoute from "./routes/user.js";
import applicationRoute from "./routes/application.js"

// importing authentication verifier
import { verifyUser } from "./middleware/verify.js"

// middleware
import { globalLimiter } from "./middleware/rateLimiter.js"

app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}))
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}))
app.use(cookieParser())
app.use(express.json())
app.set("trust proxiy", 1)


// routes
app.use('/user', userRoute)
app.use("/application", globalLimiter, verifyUser, applicationRoute);

app.get('/', (req, res) => {
    return res.end("server is running")
})

app.use((req, res) => {
    return res.status(404).json({ success: false, message: "Route not found" })
})

app.use((error, req, res, next) => {
    console.error(error)
    const statusCode = error.statusCode || 500;
    const message = error.statusCode ? error.message : "Internal server error"
    return res.status(statusCode).json({ success: false, message })
})

app.listen(config.PORT, () => {
    console.log('server started on port:', config.PORT)
})