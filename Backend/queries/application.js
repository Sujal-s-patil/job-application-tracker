import pool from "../db/pool.js"

async function getAllApplications(userId) {
    const [rows] = await pool.query(`SELECT id,title,roleApplied,jobDescription FROM applications where userId=?`, [userId]);
    return rows;
}

async function insertIntoApplications(data, userId) {
    const keys = Object.keys(data);
    const values = [userId, ...Object.values(data)]
    const query = `INSERT INTO applications (userId,${keys}) values (?,${new Array(keys.length).fill("?").join(",")})`;
    await pool.query(query, values);
}

async function getApplicationById(id, userId) {
    const [row] = await pool.query(`SELECT * FROM applications WHERE id=? AND userId=?`, [id, userId])
    return row[0] ?? null
}

async function deleteApplicationById(id, userId) {
    const [result] = await pool.query(`DELETE FROM applications WHERE id=? AND userId=?`, [id, userId])
    return result.affectedRows
}

async function updateApplicationById(data, id, userId) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    values.push(id);
    values.push(userId);
    const query = `UPDATE applications set ${keys.map((v) => v + '=?')} where id=? and userId=?`;
    const [result] = await pool.query(query, values);
    return result.affectedRows
}

async function updateApplicationStatusById(status, id, userId) {
    const [result] = await pool.query(`UPDATE applications SET status=? WHERE id=? AND userId=?`, [status, id, userId]);
    return result.affectedRows
}

export {
    getAllApplications,
    insertIntoApplications,
    getApplicationById,
    deleteApplicationById,
    updateApplicationById,
    updateApplicationStatusById
}