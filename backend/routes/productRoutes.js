const express = require('express');
const router = express.Router();
const {
  getPublicProducts,
  getProductById,
} = require('../controllers/productController');

// Public Product Catalog Routes
router.get('/', getPublicProducts);
router.get('/:id', getProductById);

module.exports = router;
