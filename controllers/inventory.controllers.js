const db_pool = require('../database/connection');
const logger = require('../utils/logger.utils');

async function get_inventory_levels(req, res)
{
    try {
        const connection = await db_pool.getConnection();
        const query = "SELECT * FROM inventory;";
        const [rows, _fields] = await connection.query(query);
        connection.release();
        logger.info("A list of inventory levels")
        res.status(200).json({
            ...rows
        })
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

module.exports = {get_inventory_levels, }