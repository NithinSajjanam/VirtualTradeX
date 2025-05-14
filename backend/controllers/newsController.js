const axios = require('axios');
const Portfolio = require('../models/Portfolio');

const getNews = async (req, res) => {
  let baseUrl = process.env.CURRENTS_BASE_URL;
  const apiKey = process.env.CURRENTS_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error('Environment variables CURRENTS_BASE_URL or CURRENTS_API_KEY are not set');
    return res.status(500).json({ error: 'Server configuration error: Missing API credentials' });
  }

  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }

  try {
    const response = await axios.get(`${baseUrl}latest-news`, {
      params: { apiKey }
    });

    if (response.data && response.data.news) {
      console.log('News array length:', response.data.news.length);
      return res.json(response.data.news);
    } else {
      console.log('No news array found in response');
      return res.json([]);
    }
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error.response ? JSON.stringify(error.response.data) : error.message)
      : 'Error fetching news';
    return res.status(500).json({ error: errorMessage });
  }
};

const getNewsForTopHoldings = async (req, res) => {
  let baseUrl = process.env.CURRENTS_BASE_URL;
  const apiKey = process.env.CURRENTS_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error('Environment variables CURRENTS_BASE_URL or CURRENTS_API_KEY are not set');
    return res.status(500).json({ error: 'Server configuration error: Missing API credentials' });
  }

  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }

  try {
    const topHoldings = await Portfolio.aggregate([
      { $unwind: '$stocks' },
      {
        $group: {
          _id: '$stocks.stockSymbol',
          totalQuantity: { $sum: '$stocks.quantity' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $project: {
          stockSymbol: '$_id',
          quantity: '$totalQuantity',
          _id: 0
        }
      }
    ]);

    if (!topHoldings.length) {
      return res.json([]);
    }

    const newsResults = [];

    for (const holding of topHoldings) {
      try {
        const response = await axios.get(`${baseUrl}search`, {
          params: {
            apiKey,
            keywords: holding.stockSymbol,
            language: 'en'
          }
        });

        if (response.data && response.data.news) {
          newsResults.push(...response.data.news);
        }
      } catch (error) {
        console.error(`Error fetching news for symbol ${holding.stockSymbol}:`, error.message);
      }
    }

    // Deduplicate news by ID or URL
    const uniqueNewsMap = new Map();
    newsResults.forEach((item) => {
      const key = item.id || item.url;
      if (!uniqueNewsMap.has(key)) {
        uniqueNewsMap.set(key, item);
      }
    });

    const uniqueNews = Array.from(uniqueNewsMap.values());
    return res.json(uniqueNews);
  } catch (error) {
    console.error('Error in getNewsForTopHoldings:', error);
    return res.status(500).json({ error: 'Error fetching news for top holdings' });
  }
};

module.exports = {
  getNews,
  getNewsForTopHoldings
};
