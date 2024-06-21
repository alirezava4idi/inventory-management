const express = require('express');
const app = express()
const PORT = process.env.PORT;




const logger = require('./utils/logger.utils');
const user_routes = require('./routes/users.routes');
const catagories_routes = require('./routes/catagories.routes');

app.use(express.json());
app.use(express.urlencoded( {extended: false }));
app.use((req, res, next) => {
    
    logger.info(`${req.method} ${req.url}`)
    next();
})

app.get('/api', (req, res) => {
    res.status(200).json({
        message: "Welcome to inventory management api!"
    })
})

app.use("/api/v1", user_routes)
app.use("/api/v1/catagories", catagories_routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})