const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public Contact Form Submission (Rate Limited)
router.post('/', contactLimiter, submitContact);

// Admin-Only Protected Endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/', getContacts);
router.get('/:id', getContactById);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

module.exports = router;
