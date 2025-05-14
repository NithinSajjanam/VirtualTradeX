const express = require('express');
const router = express.Router();
const { placeTrade } = require('../controllers/tradeController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, placeTrade);

module.exports = router;
