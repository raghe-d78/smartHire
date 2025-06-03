const jwt = require('jsonwebtoken');

module.exports = (requiredRole) => {
    return async(req, res, next) => {
        try {
            // Get token from header
            const token = req.header('Authorization') ? .replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ message: 'No token, authorization denied' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check role if required
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Unauthorized role' });
            }

            // Add user to request
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};