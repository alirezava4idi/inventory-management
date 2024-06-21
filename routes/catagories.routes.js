const express = require('express');
const router = express.Router();

const catagories_controllers = require('../controllers/catagories.controllers');
const protect = require('../middlewares/auth.middleware');


router.route('/').get(protect, catagories_controllers.get_all_catagories)

module.exports = router;