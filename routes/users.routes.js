const express = require('express');
const router = express.Router();


const user_controllers = require('../controllers/users.controllers');
const protect = require('../middlewares/auth.middleware');

router.route("/signup").post(user_controllers.signup);
router.route("/login").post(user_controllers.login)

router.route("/uploadprofilepic").post(protect, user_controllers.upload_profile_pic);

module.exports = router;