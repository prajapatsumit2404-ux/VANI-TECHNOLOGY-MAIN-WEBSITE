const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardSummary,
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
  getSettings,
} = require('../controllers/adminController');
const {
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markProductFeatured,
  changeProductStatus,
} = require('../controllers/productController');

// All admin routes strictly require JWT and role 'admin'
router.use(protect);
router.use(authorize('admin'));

// Dashboard Overview
router.get('/dashboard', getDashboardSummary);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Product Management (Admin)
router.get('/products', getAllProductsAdmin);
router.post('/products', createProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/featured', markProductFeatured);
router.patch('/products/:id/status', changeProductStatus);

// Analytics & Settings
router.get('/analytics', getAnalytics);
router.get('/settings', getSettings);

module.exports = router;
