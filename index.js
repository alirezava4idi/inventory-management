const express = require('express');
const app = express()
const PORT = process.env.PORT;


app.get('/api', (req, res) => {
    res.status(200).json({
        message: "Welcome to inventory management api!"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})