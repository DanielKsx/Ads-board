const express = require('express');
const router = express.Router();
const { register, login, getUser, logout } = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../config/multer.config');

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);
router.post('/logout', logout);


module.exports = router;