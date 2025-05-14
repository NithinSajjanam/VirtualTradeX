const express = require('express');
const router = express.Router();
const { getNews, getNewsForTopHoldings } = require('../controllers/newsController');

// Route to get latest news
router.get('/', getNews);

// Route to get news for top holdings
router.get('/top-holdings', getNewsForTopHoldings);

module.exports = router;
