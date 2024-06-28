const db_pool = require('../database/connection');
const {change_time_zone} = require('../utils/utils');
const logger = require('../utils/logger.utils');

const { find_catagory_by_id } = require('./catagories.controllers');

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

async function create_product(req, res)
{
    try {
        const name = (req.body.name + '').trim();
        const description = (req.body.description + '').trim();
        const price = Number(req.body.price).toFixed(2);
        const catagoryId = Number(req.body.catagoryId) ? Number(req.body.catagoryId) : -1;

        console.log(name, description, price, catagoryId);
        if (name == 'undefined' || name == undefined || name == '' 
            || price == 'NaN' || catagoryId == 'NaN' || catagoryId == NaN 
            || price == '' || catagoryId == '' || catagoryId == -1)
        {
            logger.error('invalid name or price or catagoryId')
            res.status(400).json({
                error: ['invalid request params']
            })
        }
        else
        {
            const catagory = await find_catagory_by_id(catagoryId)
            if (catagory.length == 0)
            {
                logger.error('catagory does not exist')
                res.status(404).json({
                    error: ['catagory does not exist']
                })
            }
            else
            {
                const connection = await db_pool.getConnection();
                const query = "INSERT INTO product (name, description, price, catagoryId,created_at, updated_at) VALUES (?,?,?,?,?,?);";
                const [rows, _fields] = await connection.query(query, [name, description, price, catagoryId, new Date(), new Date()]);
                connection.release();
                logger.info("product created")
                res.status(201).json({
                    product: {
                        name,
                        description,
                        price,
                        catagoryId,
                    }
                })
            }
        }


    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

async function find_product_by_id(productId)
{
    try {
        const connection = await db_pool.getConnection();
        const query = "SELECT * FROM product WHERE id = ? LIMIT 1;";
        const [rows, _fields] = await connection.query(query, [productId]);
        connection.release();
        return rows;
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

async function get_product_by_id(req, res)
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
                logger.info("Retrieve details of a specific product by its ID");
                product[0].created_at = change_time_zone(product[0].created_at, "Asia/Tehran");
                product[0].updated_at = change_time_zone(product[0].updated_at, "Asia/Tehran");
                res.status(200).json({
                    ...product[0],
                    
                })
            }
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ['internal server error']
        })
    }
}

async function update_product_by_id(req, res)
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
            }
            else
            {
                const name = (req.body.name + '').trim();
                const description = (req.body.description + '').trim();
                const price = Number(req.body.price).toFixed(2);
                const catagoryId = Number(req.body.catagoryId) ? Number(req.body.catagoryId) : -1;

                if (name == 'undefined' || name == undefined || name == '' 
                    || price == 'NaN' || catagoryId == 'NaN' || catagoryId == NaN 
                    || price == '' || catagoryId == '' || catagoryId == -1)
                {
                    logger.error('invalid name or price or catagoryId')
                    res.status(400).json({
                        error: ['invalid request params']
                    })
                }
                else
                {
                    const catagory = await find_catagory_by_id(catagoryId)
                    if (catagory.length == 0)
                    {
                        logger.error('catagory does not exist')
                        res.status(404).json({
                            error: ['catagory does not exist']
                        })
                    }
                    else
                    {
                        const connection = await db_pool.getConnection();
                        const query = "UPDATE product SET `name` = ?, `description` = ?, `price` = ?, `catagoryId` = ?, `updated_at` = ?";
                        const [rows, _fields] = await connection.query(query, [name, description, price, catagoryId, new Date()]);
                        connection.release();
                        logger.info("product updated")
                        res.status(201).json({
                            product: {
                                name,
                                description,
                                price,
                                catagoryId,
                            }
                        })
                    }
                }
            }
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

module.exports = {get_all_products, create_product, get_product_by_id, update_product_by_id}