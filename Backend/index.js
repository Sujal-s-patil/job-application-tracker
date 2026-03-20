import express from "express";

const app = express();
const port = process.env.PORT || 8000


//importing  routes
import { userRouter } from "./routes/user.js";

// middleware
app.use(express.json())


app.use('/user',userRouter)


app.get('/',(req,res)=>{
    return res.end("server is running")
})

app.listen(port, () => {
    console.log('server started on port:', port)
})