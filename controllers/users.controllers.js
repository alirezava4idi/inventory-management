const logger = require('../utils/logger.utils');

const db_pool = require('../database/connection');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('node:path');
const sharp = require('sharp');

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
        
        try {
            username = username.toLowerCase();
            const token = jwt.sign({username}, process.env.TOKEN_SECRET, {expiresIn: '1d'})
            const connection = await db_pool.getConnection();
            const query = "INSERT INTO `users` (`role`,`username`, `password`, `date_joined`, `last_login`) VALUES (?, ?, ?, ?, ?)"
            const [rows, _fields] = await connection.query(
                query,
                [0, username, hashPassword(password), new Date(), new Date()]);
            
            connection.release();   
            res.status(201).json({
                message: "User created!",
                token: token
            })
            logger.info(`${ipAddr} - - successfull request`)
        } catch (error) {
            logger.error(ipAddr + " - - " + error.message)
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

async function login(req, res)
{
    let username = (req.body.username + "").trim();
    let password = (req.body.password + "").trim();
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (username == "" || password == "" || username == 'undefined' || password == 'undefined')
    {
        logger.error(`${ipAddr} - - invalid username or password`)
        res.status(400).json({
            error: "invalid username or password"
        })
    }
    else
    {
        try {
            const user = await get_user_by_username(username);
        if (user == undefined)
        {
            logger.error(`${ipAddr} - - username/password incorrect`)
            res.status(400).json({
                error: "invalid username or password"
            })
        }
        else
        {
            const isPasswordValid = verifyPassword(password, user.password)
            if (isPasswordValid)
            {
                const token = jwt.sign({username}, process.env.TOKEN_SECRET, {expiresIn: '1d'})
                const connection = await db_pool.getConnection();
                const query = "UPDATE `users` SET `last_login` = ? WHERE `username` = ? LIMIT 1";
                const [result, _fields] = await connection.execute(query, [new Date(), username]);
                
                connection.release();
                res.status(200).json({
                    message: "welcome",
                    token
                })
            }
            else
            {
                logger.error(`${ipAddr} - - username/password incorrect`)
                res.status(400).json({
                    error: "invalid username or password"
                })
            }
        }
        } catch (error) {
            
            logger.error(`${ipAddr} - - ${error.message}`)
                res.status(500).json({
                    error: "internal server error"
                })
        }
        
    }
}

function verifyPassword(password, hashed)
{
    return bcrypt.compareSync(password, hashed)
}


async function get_user_by_username(username)
{
    const connection = await db_pool.getConnection();
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows, _fields] = await connection.query(query, [username]);
    connection.release();
    if (rows != [])
    {
        return rows[0];
    }else
    {
        return undefined;
    }
}

function upload_profile_pic(req, res){
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb){
                cb(null, path.join(__dirname, "..", "/uploads"))
            },
            filename: function (req, file, cb) {
                const name = req.user.username + `.${file.originalname.split(".")[1]}`;
                cb(null, name)
            },
            
        })
        const upload = multer( {storage: storage, limits: {fileSize: 2000000} } ).single('avatar');
        
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError)
            {
                logger.error(`${ipAddr} - - ${err.message}`)
                res.status(400).json({error: err.message})
            }
            else if (err)
            {
                logger.error(`${ipAddr} - - ${err.message}`)
                res.status(500).json({err})

            }
            else
            {
                console.log(req.file, req.user.username)
                const connection = await db_pool.getConnection();
                const query = "UPDATE `users` SET `avatar` = ? WHERE `username` = ? LIMIT 1";
                connection.query(query, [req.file.path, req.user.username]);
                connection.release();
                logger.info(`${ipAddr} - - avatar upload was successfull`)
                res.status(200).json({
                    message: "avatar was uploaded successfully"
                })

            }
        })
    } catch (error) {
        res.status(500).json({error})
    }
    
}



module.exports = { signup, login, upload_profile_pic };