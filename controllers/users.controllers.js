const logger = require('../utils/logger.utils');

function signup(req, res)
{
    let username = (req.body.username + "").trim();
    let password = (req.body.password + "").trim();
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
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
        logger.info(`${ipAddr} - - successfull request`)
        res.status(200).json({
            username,
            password
        })
    }
}


module.exports = { signup };