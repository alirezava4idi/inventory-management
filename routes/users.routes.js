const express = require('express');
const router = express.Router();


const user_controllers = require('../controllers/users.controllers');

router.route("/signup").post(user_controllers.signup);
router.route("/login").post(user_controllers.login)

module.exports = router;