const express = require('express');
const router = express.Router();
const { getPortfolio, getTopHoldings } = require('../controllers/portfolioController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getPortfolio);
router.get('/top-holdings', getTopHoldings);

module.exports = router;
