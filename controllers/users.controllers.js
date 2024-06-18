const logger = require('../utils/logger.utils');

const db_pool = require('../database/connection');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signup(req, res)
{
    let username = (req.body.username + "").trim();
    let password = (req.body.password + "").trim();
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    let username_pattern = new RegExp('^[a-zA-Z0-9]{3,20}$');
    let password_pattern = new RegExp(`^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$`);

    if (username == "" || password == "" || username == 'undefined' || password == "undefined")    
    {
        logger.error(`${ipAddr} - - ` + "username and/or password cannot empty")
        res.status(400).json({
            error: "username and/or password cannot empty"
        })
    }
    else if (username_pattern.test(username) == false || password_pattern.test(password) == false)
    {
        res.status(400).json({
            error: "username and/or password are the wrong format"
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
                [0, username, hashPassword(password), new Date(), new Date()]);
            
            connection.release();   
            const token = jwt.sign({username}, process.env.TOKEN_SECRET, {expiresIn: '1d'})
            res.status(201).json({
                message: "User created!",
                token: token
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



function hashPassword(password)
{
    const hashed = bcrypt.hashSync(password, 10);
    return hashed;
}

function verifyPassword(password, hashed)
{
    return bcrypt.compareSync(password, hashed)
}



module.exports = { signup };