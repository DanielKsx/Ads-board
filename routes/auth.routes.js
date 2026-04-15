const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { login, password, avatar, phone } = req.body;
    const user = await User.findOne({ login });
    if (user) {
        return res.status(400).json({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ login, password: hashedPassword, avatar, phone });
    await newUser.save();
    res.json({ id: newUser._id, login: newUser.login });
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (!user) {
        return res.status(400).json({ message: 'Invalid login or password' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid login or password' });
    }
    req.session.user = { id: user._id, login: user.login };
    res.json({ id: user._id, login: user.login });
});

router.get('/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    res.json(req.session.user)
});

router.delete('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({ message: 'Something went wrong'})
        } else {
            res.json({ message: 'Logged out' });
        }
    });
});

module.exports = router;