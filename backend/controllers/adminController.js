const User = require('../models/User');
const Contact = require('../models/Contact');
const Product = require('../models/Product');
const os = require('os');

/**
 * @desc    Get top-level dashboard metrics & recent activity
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalContacts,
      newContacts,
      totalProducts,
      activeProducts,
      featuredProducts,
      recentUsers,
      recentContacts,
    ] = await Promise.all([
      User.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ featured: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      Contact.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalUsers,
        totalContacts,
        newContacts,
        totalProducts,
        activeProducts,
        featuredProducts,
      },
      recentUsers,
      recentContacts,
    });
  } catch (error) {
    console.error('[Admin Dashboard Error]:', error);
    next(error);
  }
};

/**
 * @desc    View all registered users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role;
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [{ fullName: regex }, { email: regex }, { phone: regex }];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -verificationToken -otp')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      users,
    });
  } catch (error) {
    console.error('[Admin Get Users Error]:', error);
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be user or admin.',
      });
    }

    // Prevent demoting self
    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove admin privileges from your own account.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error('[Admin Update User Role Error]:', error);
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User '${user.fullName}' has been permanently deleted.`,
    });
  } catch (error) {
    console.error('[Admin Delete User Error]:', error);
    next(error);
  }
};

/**
 * @desc    Get detailed platform analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    // 1. Leads breakdown by requested service
    const serviceAggregation = await Contact.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 2. Leads breakdown by status
    const statusAggregation = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 3. Products breakdown by category
    const categoryAggregation = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 4. Verification health metrics
    const [verifiedEmails, verifiedPhones, totalUsers] = await Promise.all([
      User.countDocuments({ emailVerified: true }),
      User.countDocuments({ phoneVerified: true }),
      User.countDocuments(),
    ]);

    // 5. System diagnostics
    const diagnostics = {
      platform: os.platform(),
      arch: os.arch(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      systemFreeMemMB: Math.round(os.freemem() / (1024 * 1024)),
      systemTotalMemMB: Math.round(os.totalmem() / (1024 * 1024)),
    };

    res.status(200).json({
      success: true,
      analytics: {
        leadsByService: serviceAggregation,
        leadsByStatus: statusAggregation,
        productsByCategory: categoryAggregation,
        verificationMetrics: {
          totalUsers,
          verifiedEmails,
          verifiedPhones,
          emailVerificationRate: totalUsers > 0 ? Math.round((verifiedEmails / totalUsers) * 100) : 0,
          phoneVerificationRate: totalUsers > 0 ? Math.round((verifiedPhones / totalUsers) * 100) : 0,
        },
        diagnostics,
      },
    });
  } catch (error) {
    console.error('[Admin Analytics Error]:', error);
    next(error);
  }
};

/**
 * @desc    Get system settings & status
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
exports.getSettings = async (req, res) => {
  res.status(200).json({
    success: true,
    settings: {
      siteName: 'Vani Technologies',
      supportPhone: '+91-7773895639',
      supportEmail: 'support@vanitechnologies.in',
      officialWebsite: 'www.vanitechnologies.in',
      mockOtpMode: process.env.MOCK_OTP === 'true',
      nodeEnvironment: process.env.NODE_ENV || 'development',
      jwtTokenDuration: '7 Days',
      rateLimitWindowMinutes: 15,
      rateLimitMaxPerWindow: 10,
    },
  });
};
