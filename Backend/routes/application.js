import express from "express";
const applicationRoute = express.Router();
import validate from "../middleware/validation.js"
import { createApplicationSchema, updateApplicationSchema, updateApplicationStatusSchema } from "../schemas/applicationSchema.js";

import {
    getApplications,
    getApplication,
    createApplication,
    deleteApplication,
    updateApplication,
    updateApplicationStatus
} from "../controllers/application.js"

applicationRoute
    .route("/")
    .get(getApplications)
    .post(validate(createApplicationSchema), createApplication)

applicationRoute
    .route("/:id")
    .get(getApplication)
    .put(validate(updateApplicationSchema), updateApplication)
    .delete(deleteApplication)

applicationRoute
    .patch('/:id/status', validate(updateApplicationStatusSchema), updateApplicationStatus)

export default applicationRoute;