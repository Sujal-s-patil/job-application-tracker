import express from "express";

const applicationRoute = express.Router();

import {
    getAppliactions,
    getApplication,
    createApplication,
    deleteApplication,
    updateApplication
} from "../controllers/application.js"

applicationRoute.get("/", getAppliactions);

applicationRoute.post('/', createApplication);

applicationRoute
    .route("/:id")
    .get(getApplication)
    .put(updateApplication)
    .delete(deleteApplication)

export {
    applicationRoute
}