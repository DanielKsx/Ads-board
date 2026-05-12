const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const cors = require('cors');
const path = require('path');

const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

require('./models/Ad.model');
require('./models/User.model');

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();


app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.static('public'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: MongoStore.create({ mongoUrl: process.env.DB_URL }), cookie: { secure: false }, }));
app.use('/api/ads', adsRoutes);
app.use('/auth', authRoutes);

app.get('/api/test', (req, res) => {
    res.send({ message: "test" })
});
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

app.use(errorHandler);

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to the database');

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch(err => console.log('Error: ' + err));