import { z } from "zod";

const applicationSchema = z.object({
    userId: z.number(),
    title: z.string().nonempty(),
    roleApplied: z.string().nonempty(),
    jobDescription: z.string().nonempty(),
    applicationStatus: z.enum(["applied", "interview", "accepted", "rejected"]).default('applied'),
    noteForApplied: z.string().nonempty().optional(),
    noteForInterview: z.string().nonempty().optional(),
    noteForAccepted: z.string().nonempty().optional(),
    noteForRejected: z.string().nonempty().optional(),
}).strict()

/* 
CREATE TABLE applications(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(200),
    roleApplied VARCHAR(200),
    jobDescription TEXT,
    dateApplied DATETIME DEFAULT CURRENT_TIMESTAMP,
    applicationStatus ENUM("applied","interview","accepted","rejected") DEFAULT "applied",
    noteForApplied TEXT,
    noteForInterview TEXT,
    noteForAccepted TEXT,
    noteForRejected TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
*/





export {
    applicationSchema
}



