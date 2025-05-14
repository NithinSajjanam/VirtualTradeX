const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type:   { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  tradeDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);
