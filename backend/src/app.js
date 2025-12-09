const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Tafukt Trail API' });
});

// Error handling middleware placeholder
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
