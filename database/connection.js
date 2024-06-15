const mysql = require('mysql2/promise');
const logger = require('../utils/logger.utils');


try {
    // const pool = mysql.createPool("mysql://brad:12345@db:3306/db?timezone=+03:30");

    const pool = mysql.createPool({
        host: 'db',
        user: 'brad',
        password: '12345',
        database: 'db',
        timezone: "+03:30"
    })

    module.exports = pool
    
} catch (error) {
    logger.error(error)
}
