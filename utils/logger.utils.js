const winston = require('winston');
const fs = require('fs');
const path = require('path');


if (!fs.existsSync('../logs'))
{
    fs.mkdirSync('../logs');
}

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, "..", "/logs", "combined.log"),
            format: winston.format.printf((info) => {
                return `${info.message} [${new Date().toString()}]`
            }),
        }),
        new winston.transports.File({
            filename: path.join(__dirname, "..", "/logs", "errors.log"),
            level: 'error',
            format: winston.format.printf((info) => {
                return `${info.message} [${new Date().toString()}]`
            })
        })
    ]
})

module.exports = logger