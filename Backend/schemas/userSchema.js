import { z } from "zod";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().trim().min(8,'password is required')
}).strict()

const registerSchema = z.object({
    firstName: z.string().trim().min(1,'firstName is required'),
    lastName: z.string().trim().min(1,'lastName is required'),
    email: z.email(),
    password: z.string().trim().min(8,'password is required')
}).strict()


export {
    loginSchema,
    registerSchema
}