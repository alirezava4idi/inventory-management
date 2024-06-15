const logger = require('../utils/logger.utils');

const db_pool = require('../database/connection');


async function signup(req, res)
{
    let username = (req.body.username + "").trim();
    let password = (req.body.password + "").trim();
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    let username_pattern = new RegExp('^[a-zA-Z0-9]{3, 20}$');
    let password_pattern = new RegExp(`^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$`)
    if (username == "" || password == "" || username == 'undefined' || password == "undefined")    
    {
        logger.error(`${ipAddr} - - ` + "username and/or password cannot empty")
        res.status(400).json({
            error: "username and/or password cannot empty"
        })
    }
    else
    {
        username = username.toLowerCase();
        
        try {
            const connection = await db_pool.getConnection();
            const query = "INSERT INTO `users` (`role`,`username`, `password`, `date_joined`, `last_login`) VALUES (?, ?, ?, ?, ?)"
            const [rows, _fields] = await connection.query(
                query,
                [0, username, password, new Date(), new Date()]);
            console.log(rows)
            connection.release();   
            res.status(201).json({
                message: "User created!"

            })
            logger.info(`${ipAddr} - - successfull request`)
        } catch (error) {
            logger.error(error.message)
            if (error.code == "ER_DUP_ENTRY")
            {
                res.status(400).json({
                    error: 'Username already exists!'
                })
            }else
            {
                res.status(500).json({
                    error: 'Internal Server error!'
                })

            }
        }
    }
}



module.exports = { signup };