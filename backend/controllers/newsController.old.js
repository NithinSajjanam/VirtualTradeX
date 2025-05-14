const axios = require('axios');
const Portfolio = require('../models/Portfolio');

const getNews = async (req, res) => {
  const baseUrl = process.env.VITE_CURRENTS_BASE_URL;
  const apiKey = process.env.VITE_CURRENTS_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error('Environment variables VITE_CURRENTS_BASE_URL or VITE_CURRENTS_API_KEY are not set');
    return res.status(500).json({ error: 'Server configuration error: Missing API credentials' });
  }

  try {
    // Use query parameter apiKey instead of Authorization header
    const response = await axios.get(`${baseUrl}latest-news`, {
      params: {
        apiKey: apiKey
      }
    });
    console.log('Currents API response:', response.data);
    if (response.data && response.data.news) {
      console.log('News array length:', response.data.news.length);
    } else {
      console.log('No news array found in response');
    }
    res.json(response.data.news || []);
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    const errorMessage = process.env.NODE_ENV === 'development' ? (error.response ? JSON.stringify(error.response.data) : error.message) : 'Error fetching news';
    res.status(500).json({ error: errorMessage });
  }
};

const getNewsForTopHoldings = async (req, res) => {
  const baseUrl = process.env.VITE_CURRENTS_BASE_URL;
  const apiKey = process.env.VITE_CURRENTS_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error('Environment variables VITE_CURRENTS_BASE_URL or VITE_CURRENTS_API_KEY are not set');
    return res.status(500).json({ error: 'Server configuration error: Missing API credentials' });
  }

  try {
    // Aggregate top holdings by stockSymbol and sum quantities
    const topHoldings = await Portfolio.aggregate([
      { $unwind: '$stocks' },
      { $group: { _id: '$stocks.stockSymbol', totalQuantity: { $sum: '$stocks.quantity' } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      { $project: { stockSymbol: '$_id', quantity: '$totalQuantity', _id: 0 } }
    ]);

    if (!topHoldings || topHoldings.length === 0) {
      return res.json([]);
    }

    // Fetch news for each top holding stock symbol
    const newsResults = [];

    for (const holding of topHoldings) {
      const symbol = holding.stockSymbol;
      try {
        const response = await axios.get(`${baseUrl}search`, {
          params: {
            apiKey: apiKey,
            keywords: symbol,
            language: 'en'
          }
        });
        if (response.data && response.data.news) {
          newsResults.push(...response.data.news);
        }
      } catch (error) {
        console.error(`Error fetching news for symbol ${symbol}:`, error.message);
      }
    }

    // Remove duplicates by news id or url
    const uniqueNewsMap = new Map();
    newsResults.forEach((item) => {
      const key = item.id || item.url;
      if (!uniqueNewsMap.has(key)) {
        uniqueNewsMap.set(key, item);
      }
    });

    const uniqueNews = Array.from(uniqueNewsMap.values());

    res.json(uniqueNews);
  } catch (error) {
    console.error('Error in getNewsForTopHoldings:', error);
    res.status(500).json({ error: 'Error fetching news for top holdings' });
  }
};

module.exports = { getNews, getNewsForTopHoldings };

module.exports = { getNews, getNewsForTopHoldings };
