import { z } from "zod";

const envSchema = z.object({
    SECRET_KEY: z.string().min(32, "secret key is required"),
    PORT: z.coerce.number().int().positive().default(8000),
    DB_HOST: z.string().min(1, "database hostname is required"),
    DB_USER: z.string().min(1, "username for database is required"),
    DB_PASSWORD: z.string().min(1, "password for database is required"),
    DB_NAME: z.string().min(1, "database name is required"),
    DB_CONNECTION_LIMIT: z.coerce.number().int().positive().default(20),
    CLIENT_URL: z.string().min(1, "client url is required"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development")
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error("Invalid environment config:");
    const flattened = parsed.error.flatten();
    console.error("Flattened Errors : ", flattened)
    process.exit(1);
}

export default parsed.data