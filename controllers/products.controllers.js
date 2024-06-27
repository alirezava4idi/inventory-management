const db_pool = require('../database/connection');
const {change_time_zone} = require('../utils/utils');
const logger = require('../utils/logger.utils');


async function get_all_products(req, res)
{
    try {
        const connection = await db_pool.getConnection();
        const query = "SELECT id, name, description, price, created_at, updated_at FROM product";
        let [rows, _fields] = await connection.query(query);
        connection.release()
        rows = rows.map(row => {
            return {
                ...row,
                created_at: change_time_zone(row["created_at"], "Asia/Tehran"),
                updated_at: change_time_zone(row["updated_at"], "Asia/Tehran")
            }
        })
        logger.info("all Categories founded")
        res.status(200).json({
            products: rows
        })

    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

module.exports = {get_all_products,}