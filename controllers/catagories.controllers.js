
const db_pool = require('../database/connection');

async function get_all_catagories(req, res)
{
    const connection = await db_pool.getConnection();
    const query = "SELECT * FROM catagory";
    let [rows, _fields] = await connection.query(query);
    connection.release();
    rows = rows.map(row => {
        return {
            ...row,
            created_at: change_time_zone(row["created_at"], "Asia/Tehran"),
            updated_at: change_time_zone(row["updated_at"], "Asia/Tehran")
        }
    })
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

async function get_catagory_by_id(req, res)
{
    try {
        const catagory_id = +(req.params.catagoryId + "").trim();
        if (catagory_id == null)
        {
            res.status(404).json({
                error: ["Category not found"]
            })
        }else
        {
            const rows = await find_catagory_by_id(catagory_id);
            if (rows.length == 0)
            {
                res.status(404).json({
                    error: ["Category not found"]
                })
            }else
            {
                rows[0]["created_at"] = change_time_zone(rows[0]["created_at"], "Asia/Tehran")
                rows[0]["updated_at"] = change_time_zone(rows[0]["updated_at"], "Asia/Tehran")
                res.status(200).json({
                    Catagory: rows[0]
                })

            }
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

function change_time_zone(date, tz)
{
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tz}));   

}

async function find_catagory_by_id(catagory_id)
{
    const connection = await db_pool.getConnection();
    const query = "SELECT * FROM catagory WHERE id = ? LIMIT 1";
    const [rows, _fields] = await connection.query(query, [catagory_id]);
    connection.release();
    return rows;
}

async function update_catagory(req, res)
{
    try {
        const catagory_id = +(req.params.catagoryId + "").trim();
        if (catagory_id == null)
        {
            res.status(404).json({
                error: ["Category not found"]
            })
        }
        else
        {
            const result = await find_catagory_by_id(catagory_id);
            if (result.length == 0)
            {
                res.status(404).json({
                    error: ["Category not found"]
                })
            }
            else
            {

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
                    const query = "UPDATE catagory SET name = ?, description = ?, updated_at = ? WHERE id = ? LIMIT 1;";
                    const [rows, _fields] = await connection.query(query, [name, desc, new Date(), catagory_id]);
                    console.log(rows);
                    connection.release();
                    res.status(200).json({
                        message: "Category updated successfully",
                        Catagory: {name, desc}
                    })
                } 
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: ["internal server error"]
        })
    }
}

module.exports = { get_all_catagories, create_new_catagory, get_catagory_by_id, update_catagory}