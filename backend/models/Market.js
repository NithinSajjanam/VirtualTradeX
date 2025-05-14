const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  price: Number,
  change: Number,
  volume: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Market', marketSchema);
