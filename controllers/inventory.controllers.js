const db_pool = require('../database/connection');
const logger = require('../utils/logger.utils');

const { find_product_by_id } = require('./products.controllers');
const { change_time_zone } = require('../utils/utils');

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


async function get_inventory_level_product(req, res)
{
    try {
        let productId = (req.params.productId).trim();
        productId = Number(productId) ? Number(productId) : -1;
        if (productId == null || productId == 'null' || productId == -1)
        {
            logger.error("invalid id in url");
            res.status(400).json({
                error: ['bad product id']
            })
        }else
        {
            
            const product = await find_product_by_id(productId);
            if (product.length == 0)
            {
                logger.info("Product not found");
                res.status(404).json({
                    message: "Product not found"
                })
            }else
            {
                const connection = await db_pool.getConnection();
                const query = "SELECT * FROM inventory WHERE productId = ?";
                const [rows, _fields] = await connection.query(query, [productId]);
                connection.release()
                logger.info("Retrieve the current inventory level for a specific product");
                rows[0].created_at = change_time_zone(product[0].created_at, "Asia/Tehran");
                rows[0].updated_at = change_time_zone(product[0].updated_at, "Asia/Tehran");
                res.status(200).json(...rows)
            }
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ['internal server error']
        })
    }
}
module.exports = {get_inventory_levels, get_inventory_level_product}