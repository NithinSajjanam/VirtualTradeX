const Trade = require('../models/Trade');

// Dummy user data for simulation
const dummyUser = {
  balance: 50000, // ₹50,000
  portfolio: {
    AAPL: 10,
    TSLA: 5,
  },
};

// Dummy stock prices
const stockPrices = {
  AAPL: 2000,
  TSLA: 3000,
  GOOGL: 1500,
};

const placeTrade = async (req, res) => {
  try {
    const { stockSymbol, quantity, tradeType } = req.body;
    const symbol = stockSymbol.toUpperCase();
    const qty = Number(quantity);

    if (!stockPrices[symbol]) {
      return res.status(400).json({ error: 'Invalid stock symbol' });
    }

    const price = stockPrices[symbol];
    const cost = price * qty;

    if (tradeType === 'buy') {
      if (dummyUser.balance >= cost) {
        dummyUser.balance -= cost;
        dummyUser.portfolio[symbol] = (dummyUser.portfolio[symbol] || 0) + qty;
      } else {
        return res.status(400).json({ error: 'Not enough balance' });
      }
    } else if (tradeType === 'sell') {
      if ((dummyUser.portfolio[symbol] || 0) >= qty) {
        dummyUser.portfolio[symbol] -= qty;
        dummyUser.balance += cost;
      } else {
        return res.status(400).json({ error: 'Not enough shares to sell' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid trade type' });
    }

    // Save trade record (optional, can be skipped in dummy simulation)
    const newTrade = new Trade(req.body);
    await newTrade.save();

    return res.status(201).json({
      message: 'Trade successful',
      balance: dummyUser.balance,
      portfolio: dummyUser.portfolio,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Trade failed' });
  }
};

module.exports = { placeTrade };
