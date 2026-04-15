const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const router = express.Router();
const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');
const session = require('express-session');

require('./models/Ad.model');
require('./models/User.model');

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${PORT}`)
});

app.use(express.json());
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: false }));
app.use('/api/ads', adsRoutes);
app.use('/auth', authRoutes);

app.get('/api/test', (req, res) => {
    res.send({ message: "test" })
});


mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to the database'))
    .catch(err => console.log('Error: ' + err));