const express = require('express');
const router = express.Router();
const { register, login, getUser, logout } = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware');


router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);
router.post('/logout', logout);


module.exports = router;