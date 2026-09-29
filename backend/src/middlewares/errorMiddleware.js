const notFoundHandler = (req, res) => {
    res.status(404).json({ message: 'Ressource introuvable' });
};

const errorHandler = (err, req, res, _next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Erreur interne du serveur';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Identifiant invalide';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Doublon';
    }

    if (statusCode === 500 && !err.isOperational && !err.statusCode && !err.status) {
        message = 'Erreur interne du serveur';
    }

    const response = { message };
    if (process.env.NODE_ENV === 'development' && err.stack) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = { notFoundHandler, errorHandler };
