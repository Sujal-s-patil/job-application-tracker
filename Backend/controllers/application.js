import { pool } from "../db/sql.js";


async function getAppliactions(req, res) {
    try {
        const query = 'SELECT id,title,roleApplied,jobDescription FROM applications where userId=?'
        const [rows] = await pool.query(query, req.user.id);
        return res.status(200).json({ status: true, rows })
    } catch (error) {
        return res.status(500).json({ status: false, message: "interval server error" })

    }

}

async function createApplication(req, res) {
    try {
        const keys = Object.keys(req.body);
        const values = [req.user.id, ...Object.values(req.body)]
        const query = `INSERT INTO applications (userId,${keys}) values (?,${new Array(keys.length).fill("?").join(",")})`;

        await pool.query(query, values);
        return res.status(201).json({ status: true, message: "created application" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }

}

async function getApplication(req, res) {
    try {
        const id = req.params.id
        const query = `select * from applications where id=? and userId=?`;
        const [row] = await pool.query(query, [id, req.user.id]);

        if (row.length === 0) {
            return res.status(400).json({ status: false, message: "application does not exist" })
        }

        return res.status(200).json({ status: true, message: "successfull", row })
    } catch (error) {
        return res.status(500).json({ status: false, message: "internal server error" })

    }
}

async function deleteApplication(req, res) {
    try {
        const id = req.params.id;
        const query = `delete from applications where id=?`
        await pool.query(query, id)
        return res.status(204).json({ status: true, message: "deleted the application successfully" })
    } catch (error) {
        return res.status(400).json({ status: false, message: "application does not exist" })
    }
}

async function updateApplication(req, res) {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(401).json({ success: false, message: "id is not provided" })
        }
        delete req.body.id;
        const keys = Object.keys(req.body);
        const values = Object.values(req.body)
        values.push(id);
        const query = `UPDATE applications set ${keys.map((v) => v + '=?')} where id=?`;
        const result = await pool.query(query, values);
        return res.status(201).json({ status: true, message: "updated application" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}

export {
    getAppliactions,
    getApplication,
    createApplication,
    deleteApplication,
    updateApplication
}
