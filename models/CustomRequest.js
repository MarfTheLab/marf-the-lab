const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  style: { type: String, enum: ['ANIME', 'REALISTIC', 'HYBRID'], required: true },
  productType: { type: String, required: true },
  description: { type: String, required: true },
  referenceImages: [{ type: String }],
  estimatedPrice: { type: Number, required: true },
  status: { type: String, default: 'PENDING_REVIEW' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CustomRequest || mongoose.model('CustomRequest', customRequestSchema);
