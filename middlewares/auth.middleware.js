const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.utils');

const { get_user_by_username } = require('../utils/utils');

async function protect(req, res, next)
{
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) throw new Error();
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        const u = await get_user_by_username(user.username);
        if (!u) throw new Error();
        req.user = user;
        logger.info(`${ipAddr} - - authorize access`)
        next();
    } catch (error) {
        logger.error(`${ipAddr} - - invalid token`)
        res.status(401).json({
            error: "Unathorized"
        })
    }
}

module.exports = protect;