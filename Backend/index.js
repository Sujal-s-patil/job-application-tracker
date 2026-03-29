import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 8000


//importing  routes
import { userRoute } from "./routes/user.js";
import { applicationRoute } from "./routes/application.js"

// importing local middlewares
// importing authentication verifier
import { verifyUser } from "./middleware/verify.js"
import {validateUser} from "./middleware/validation.js"


// middleware
app.use(express.json())
app.use(cookieParser())


// routes
app.use('/user',validateUser,userRoute)
app.use("/application", verifyUser, applicationRoute);

app.get('/', (req, res) => {
    return res.end("server is running")
})

app.listen(port, () => {
    console.log('server started on port:', port)
})