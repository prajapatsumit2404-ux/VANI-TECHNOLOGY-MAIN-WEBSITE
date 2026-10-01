const Product = require('../models/Product');

/**
 * @desc    Get all public active products
 * @route   GET /api/products
 * @access  Public
 */
exports.getPublicProducts = async (req, res, next) => {
  try {
    const query = { status: 'active' };

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.featured === 'true') {
      query.featured = true;
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: regex }, { description: regex }, { category: regex }];
    }

    const products = await Product.find(query).sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('[Get Public Products Error]:', error);
    next(error);
  }
};

/**
 * @desc    Get all products for Admin (all statuses)
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.featured !== undefined && req.query.featured !== 'all') {
      query.featured = req.query.featured === 'true';
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: regex }, { description: regex }, { category: regex }];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    console.error('[Admin Get All Products Error]:', error);
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/admin/products/:id or GET /api/products/:id
 * @access  Public / Admin
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('[Get Product Error]:', error);
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      features,
      pricing,
      image,
      liveUrl,
      featured,
      status,
      sortOrder,
    } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required.',
      });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product description is required.',
      });
    }

    // Parse features if string array or comma string
    let parsedFeatures = [];
    if (Array.isArray(features)) {
      parsedFeatures = features.filter((f) => typeof f === 'string' && f.trim());
    } else if (typeof features === 'string') {
      parsedFeatures = features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);
    }

    const product = await Product.create({
      name: name.trim(),
      category: category || 'Services',
      description: description.trim(),
      features: parsedFeatures,
      pricing: pricing ? pricing.trim() : 'Custom Pricing / Enterprise',
      image: image ? image.trim() : 'assets/images/logo.png',
      liveUrl: liveUrl ? liveUrl.trim() : '#',
      featured: featured === true || featured === 'true',
      status: status || 'active',
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product,
    });
  } catch (error) {
    console.error('[Create Product Error]:', error);
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
 * @desc    Edit/Update an existing product
 * @route   PUT /api/admin/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      features,
      pricing,
      image,
      liveUrl,
      featured,
      status,
      sortOrder,
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description.trim();
    if (pricing !== undefined) updates.pricing = pricing.trim();
    if (image !== undefined) updates.image = image.trim();
    if (liveUrl !== undefined) updates.liveUrl = liveUrl.trim();
    if (featured !== undefined) updates.featured = featured === true || featured === 'true';
    if (status !== undefined) updates.status = status;
    if (sortOrder !== undefined) updates.sortOrder = parseInt(sortOrder, 10);

    if (features !== undefined) {
      if (Array.isArray(features)) {
        updates.features = features.filter((f) => typeof f === 'string' && f.trim());
      } else if (typeof features === 'string') {
        updates.features = features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean);
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product,
    });
  } catch (error) {
    console.error('[Update Product Error]:', error);
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Product '${product.name}' was permanently deleted.`,
    });
  } catch (error) {
    console.error('[Delete Product Error]:', error);
    next(error);
  }
};

/**
 * @desc    Mark product featured / unfeatured
 * @route   PATCH /api/admin/products/:id/featured
 * @access  Private/Admin
 */
exports.markProductFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const newFeatured =
      req.body.featured !== undefined ? req.body.featured : !product.featured;
    product.featured = newFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product featured status changed to ${product.featured}`,
      product,
    });
  } catch (error) {
    console.error('[Mark Featured Error]:', error);
    next(error);
  }
};

/**
 * @desc    Change product status ('active', 'draft', 'archived')
 * @route   PATCH /api/admin/products/:id/status
 * @access  Private/Admin
 */
exports.changeProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['active', 'draft', 'archived'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowed.join(', ')}`,
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Product status updated to '${status}'`,
      product,
    });
  } catch (error) {
    console.error('[Change Product Status Error]:', error);
    next(error);
  }
};
