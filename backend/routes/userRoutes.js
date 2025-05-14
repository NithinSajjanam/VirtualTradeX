const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

console.log('userController:', userController);
console.log('userController.getUsers:', userController.getUsers);
console.log('userController.register:', userController.register);
console.log('userController.login:', userController.login);

router.get('/', verifyToken, userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
