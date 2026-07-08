import createError from "../utils/createError.js"
import {
    getAllApplications,
    insertIntoApplications,
    getApplicationById,
    deleteApplicationById,
    updateApplicationById,
    updateApplicationStatusById
} from "../queries/application.js"

async function getApplications(req, res, next) {
    try {
        const result = await getAllApplications(req.user.id)
        return res.status(200).json({ success: true, rows: result })
    } catch (error) {
        next(error)
    }

}

async function createApplication(req, res, next) {
    try {
        await insertIntoApplications(req.validatedData, req.user.id)
        return res.status(201).json({ success: true, message: "created application" })
    } catch (error) {
        next(error)
    }

}

async function getApplication(req, res, next) {
    try {
        const result = await getApplicationById(req.params.id, req.user.id)
        if (!result) throw createError("Application deos not exist", 404)
        return res.status(200).json({ success: true, row: result })
    } catch (error) {
        next(error)
    }
}

async function deleteApplication(req, res, next) {
    try {
        const result = await deleteApplicationById(req.params.id, req.user.id)
        if (!result) throw createError("Application does not exist", 404)
        return res.status(200).json({ success: true, message: "deleted the application successfully" })
    } catch (error) {
        next(error)
    }
}

async function updateApplication(req, res, next) {
    try {
        const result = await updateApplicationById(req.validatedData, req.params.id, req.user.id)
        if (!result) throw createError("Application does not exist", 404)
        return res.status(200).json({ success: true, message: "updated application" })
    } catch (error) {
        next(error)
    }
}

async function updateApplicationStatus(req, res, next) {
    try {
        const result = await updateApplicationStatusById(req.validatedData.applicationStatus, req.params.id, req.user.id)
        if (!result) throw createError("Application does not exist", 404)
        return res.status(200).json({ success: true, message: "updated successfully" })
    } catch (error) {
        next(error)
    }
}

export {
    getApplications,
    getApplication,
    createApplication,
    deleteApplication,
    updateApplication,
    updateApplicationStatus
}
