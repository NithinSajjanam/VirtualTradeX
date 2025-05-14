const axios = require('axios');

const getMarketHighlights = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.BASE_URL}latest-news`, {
      headers: {
        'Authorization': process.env.CURRENTS_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching market highlights' });
  }
};

module.exports = { getMarketHighlights };
