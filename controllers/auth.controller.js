const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

module.exports.register = async (req, res) => {
    try {
        const { login, password, phone } = req.body;
        const avatar = req.file ? `/uploads/${req.file.filename}` : null;
        if (!login || !password || !phone) {
            return res.status(400).json({
                message: 'Login, password and phone are required'
            });
        }
        if (!avatar) {
            return res.status(400).json({
                message: 'Avatar is required'
            });
        }
        const user = await User.findOne({ login });
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ login, password: hashedPassword, avatar, phone });
        await newUser.save();
        res.json({ id: newUser._id, login: newUser.login });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.login = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getUser = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    res.json(req.session.user)
};

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Something went wrong' })
        } else {
            res.json({ message: 'Logged out' });
        }
    });
};