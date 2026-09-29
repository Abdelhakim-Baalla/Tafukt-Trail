const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Identifiant invalide' });
    }
    next();
};

module.exports = validateObjectId;
module.exports.validateObjectId = validateObjectId;
