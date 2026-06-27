import { pool } from "../db/pool.js";
import { createError } from "../utils/createError.js"

async function getAppliactions(req, res, next) {
    try {
        const query = 'SELECT id,title,roleApplied,jobDescription FROM applications where userId=?'
        const [rows] = await pool.query(query, req.user.id);
        return res.status(200).json({ success: true, rows })
    } catch (error) {
        next(error)
    }

}

async function createApplication(req, res, next) {
    try {
        const keys = Object.keys(req.validatedData);
        const values = [req.user.id, ...Object.values(req.validatedData)]
        const query = `INSERT INTO applications (userId,${keys}) values (?,${new Array(keys.length).fill("?").join(",")})`;

        await pool.query(query, values);
        return res.status(201).json({ success: true, message: "created application" })
    } catch (error) {
        next(error)
    }

}

async function getApplication(req, res, next) {
    try {
        const id = req.params.id
        const query = `select * from applications where id=? and userId=?`;
        const [row] = await pool.query(query, [id, req.user.id]);

        if (row.length === 0) throw createError("Application deos not exist", 404)

        return res.status(200).json({ success: true, message: "successfull", row })
    } catch (error) {
        next(error)
    }
}

async function deleteApplication(req, res, next) {
    try {
        const id = req.params.id;
        const query = `delete from applications where id=? and userId=?`
        const [result] = await pool.query(query, [id, req.user.id])
        if (!result.affectedRows) throw createError("Application does not exist", 404)
        return res.status(204).json({ success: true, message: "deleted the application successfully" })
    } catch (error) {
        next(error)
    }
}

async function updateApplication(req, res, next) {
    try {
        if (!req.params.id) throw createError("Id is not provided", 401)

        const keys = Object.keys(req.validatedData);
        const values = Object.values(req.validatedData);
        values.push(req.params.id);
        values.push(req.user.id);
        const query = `UPDATE applications set ${keys.map((v) => v + '=?')} where id=? and userId=?`;
        const result = await pool.query(query, values);
        return res.status(201).json({ success: true, message: "updated application" })
    } catch (error) {
        next(error)
    }
}

export {
    getAppliactions,
    getApplication,
    createApplication,
    deleteApplication,
    updateApplication
}
