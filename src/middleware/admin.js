require('dotenv').config();

const adminAuth = (req, res, next) => {
    const adminApiKey = process.env.ADMIN_API_KEY;
    const providedKey = req.headers['x-admin-api-key'];
    if (req.user.role !== 'admin' || !providedKey || adminApiKey !== providedKey) {
        return res.status(403).json({ message: 'Access forbidden. Admins only.' });
    }

    next();
};

module.exports = { adminAuth };

