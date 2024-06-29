const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const inventory_controller = require('../controllers/inventory.controllers');

router.route('/').get(protect, inventory_controller.get_inventory_levels);
router.route('/:productId').get(protect, inventory_controller.get_inventory_level_product);
router.route('/:productId').put(protect, inventory_controller.update_inventory_level_product);

module.exports = router;