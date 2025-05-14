const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stocks: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      averagePrice: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
