
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

async function create_new_catagory(req, res)
{
    try {
     
        const name = (req.body.name + "").trim();
        const desc = (req.body.description + "").trim();

        if (name == "" || name == 'undefined')
        {
            res.status(400).json({
                error: ["name is required"]
            })
        }else
        {
            const connection = await db_pool.getConnection();
            const query = "INSERT INTO catagory (name, description, created_at, updated_at) VALUES (?,?,?,?);";
            const [rows, _fields] = await connection.query(query, [name, desc, new Date(), new Date()]);
            console.log(rows);
            connection.release();
            res.status(201).json({
                message: "Category created successfully",
                Catagory: {name, desc}
            })
        }   
    } catch (error) {
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

module.exports = { get_all_catagories, create_new_catagory}