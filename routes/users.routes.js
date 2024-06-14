const express = require('express');
const router = express.Router();


const user_controllers = require('../controllers/users.controllers');

router.route("/signup").post(user_controllers.signup);


module.exports = router;