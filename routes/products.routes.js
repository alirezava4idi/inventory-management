const express = require('express');
const router = express.Router();


const products_controllers = require('../controllers/products.controllers');
const protect = require('../middlewares/auth.middleware');

router.route('/').get(protect, products_controllers.get_all_products);
router.route('/').post(protect, products_controllers.create_product);
router.route('/:productId').get(protect, products_controllers.get_product_by_id);
router.route('/:productId').put(protect, products_controllers.update_product_by_id);
router.route('/:productId').delete(protect, products_controllers.delete_product_by_id);

module.exports = router