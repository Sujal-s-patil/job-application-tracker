import { z } from "zod";

const createApplicationSchema = z.object({
    title: z.string().min(1, "title is not provided"),
    roleApplied: z.string().min(1, "applied for role is not provided"),
    jobDescription: z.string().min(1, "job description is not provided"),
    applicationStatus: z.enum(["applied", "interview", "accepted", "rejected"]).default('applied'),
    noteForApplied: z.string().min(1, "applied note is not provided").optional(),
    noteForInterview: z.string().min(1, "interview note is not provided").optional(),
    noteForAccepted: z.string().min(1, "accepted note is not provided").optional(),
    noteForRejected: z.string().min(1, "rejected note is not provided").optional(),
}).strict()



const updateApplicationSchema = z.object({
    title: z.string().min(1, "title is not provided").optional(),
    roleApplied: z.string().min(1, "applied for role is not provided").optional(),
    jobDescription: z.string().min(1, "job description is not provided").optional(),
    applicationStatus: z.enum(["applied", "interview", "accepted", "rejected"]).optional(),
    noteForApplied: z.string().min(1, "applied note is not provided").optional(),
    noteForInterview: z.string().min(1, "interview note is not provided").optional(),
    noteForAccepted: z.string().min(1, "accepted note is not provided").optional(),
    noteForRejected: z.string().min(1, "rejected note is not provided").optional(),
}).strict()

const updateApplicationStatusSchema = z.object({
    applicationStatus: z.enum(["applied", "interview", "accepted", "rejected"]).optional()
}).strict()

export {
    createApplicationSchema,
    updateApplicationSchema, updateApplicationStatusSchema
}



