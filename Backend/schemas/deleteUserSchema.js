import {z} from "zod"

const deleteAccountSchema=z.object({
    password:z.string().trim().min(8,"password is required")
}).strict()

export {
    deleteAccountSchema
}