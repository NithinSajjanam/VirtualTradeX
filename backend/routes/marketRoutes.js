const express = require('express');
const router = express.Router();
const { getMarketHighlights } = require('../controllers/marketController');

router.get('/market-highlights', getMarketHighlights);

module.exports = router;
