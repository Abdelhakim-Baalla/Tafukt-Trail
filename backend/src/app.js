const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const pleinCarburantRoutes = require('./routes/pleinCarburantRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5174,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: false }));
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/trajets', trajetRoutes);
app.use('/api/v1/camions', camionRoutes);
app.use('/api/v1/remorques', remorqueRoutes);
app.use('/api/v1/pneus', pneuRoutes);
app.use('/api/v1/pleins-carburant', pleinCarburantRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Tafukt Trail' });
});

app.use((req, res) => {
    notFoundHandler(req, res);
});

app.use(errorHandler);

module.exports = app;
