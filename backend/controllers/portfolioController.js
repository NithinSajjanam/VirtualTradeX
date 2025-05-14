const Portfolio = require('../models/Portfolio');

// Existing getPortfolio function
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user.id });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching portfolio' });
  }
};

// New function to get top holdings aggregated across all portfolios
const getTopHoldings = async (req, res) => {
  try {
    // Aggregate top holdings by stockSymbol and sum quantities
    const topHoldings = await Portfolio.aggregate([
      { $unwind: '$stocks' },
      { $group: { _id: '$stocks.stockSymbol', totalQuantity: { $sum: '$stocks.quantity' } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      { $project: { stockSymbol: '$_id', quantity: '$totalQuantity', _id: 0 } }
    ]);
    console.log('Top Holdings:', topHoldings);
    res.json(topHoldings);
  } catch (error) {
    console.error('Error in getTopHoldings:', error);
    res.status(500).json({ error: 'Error fetching top holdings' });
  }
};

module.exports = { getPortfolio, getTopHoldings };
