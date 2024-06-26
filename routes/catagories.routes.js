const express = require('express');
const router = express.Router();

const catagories_controllers = require('../controllers/catagories.controllers');
const protect = require('../middlewares/auth.middleware');


router.route('/').get(protect, catagories_controllers.get_all_catagories);
router.route('/').post(protect, catagories_controllers.create_new_catagory);
router.route('/:catagoryId').get(protect, catagories_controllers.get_catagory_by_id);
router.route('/:catagoryId').put(protect, catagories_controllers.update_catagory);
router.route('/:catagoryId').delete(protect, catagories_controllers.delete_catagory);

module.exports = router;