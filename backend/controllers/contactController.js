const Contact = require('../models/Contact');

/**
 * Basic HTML sanitizer to prevent stored XSS
 */
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * @desc    Submit a new contact / project inquiry
 * @route   POST /api/contact
 * @access  Public (Rate-limited)
 */
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    // Field-level validations
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be at least 2 characters long.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({
        success: false,
        message: 'A valid contact phone number is required (at least 7 digits).',
      });
    }

    if (!service || service.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select a service or area of interest.',
      });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be at least 10 characters long.',
      });
    }

    // Capture metadata
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'] || '';

    // Create and save enquiry securely
    const contact = await Contact.create({
      name: sanitize(name),
      email: email.trim().toLowerCase(),
      phone: sanitize(phone),
      company: sanitize(company || ''),
      service: sanitize(service),
      message: sanitize(message),
      ipAddress,
      userAgent,
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        service: contact.service,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error('[Contact Submission Error]:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all contact inquiries (Admin only)
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    // Filter by status if provided
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Search by keyword in name, email, company, service
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { company: regex },
        { service: regex },
      ];
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      contacts,
    });
  } catch (error) {
    console.error('[Get Contacts Error]:', error);
    next(error);
  }
};

/**
 * @desc    Get single contact enquiry by ID (Admin only)
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('[Get Contact By ID Error]:', error);
    next(error);
  }
};

/**
 * @desc    Update contact enquiry status (Admin only)
 * @route   PATCH /api/contact/:id/status
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'in-discussion', 'resolved', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`,
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      contact,
    });
  } catch (error) {
    console.error('[Update Contact Status Error]:', error);
    next(error);
  }
};

/**
 * @desc    Delete contact enquiry (Admin only)
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact enquiry deleted successfully',
    });
  } catch (error) {
    console.error('[Delete Contact Error]:', error);
    next(error);
  }
};
