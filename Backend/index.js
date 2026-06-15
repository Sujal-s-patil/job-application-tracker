import config from "./config/env.js"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();

//importing  routes
import userRoute from "./routes/user.js";
import applicationRoute from "./routes/application.js"

// importing authentication verifier
import { verifyUser } from "./middleware/verify.js"

// middleware
import { globalLimiter } from "./middleware/rateLimiter.js"
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// routes
app.use('/user', userRoute)
app.use("/application", globalLimiter, verifyUser, applicationRoute);

app.get('/', (req, res) => {
    return res.end("server is running")
})

app.listen(config.PORT, () => {
    console.log('server started on port:', config.PORT)
})