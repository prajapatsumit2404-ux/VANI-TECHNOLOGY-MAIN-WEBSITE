const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      enum: [
        'AI',
        'CRM',
        'Community',
        'Healthcare',
        'Education',
        'E-commerce',
        'Meditation',
        'Services',
        'Other',
      ],
      default: 'Services',
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    features: {
      type: [String],
      default: [],
    },
    pricing: {
      type: String,
      trim: true,
      default: 'Custom Pricing / Enterprise',
    },
    image: {
      type: String,
      trim: true,
      default: 'assets/images/logo.png',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '#',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast filtering and search
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
