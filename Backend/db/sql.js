import mysql from "mysql2";

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
db.query('select * from users;', (error, result) => {
    if (error) {
        console.log(error)
    }
    console.log(result)
})

export {
    db
}