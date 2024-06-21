
const db_pool = require('../database/connection');

async function get_all_catagories(req, res)
{
    const connection = await db_pool.getConnection();
    const query = "SELECT * FROM catagory";
    const [rows, _fields] = await connection.query(query);
    connection.release();
    res.status(200).json({
        catagories: rows
    })
}

module.exports = { get_all_catagories,}