// routes/UserAuth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authenticate, authorize } = require('../middleware/Auth');

// Allow preflight requests
router.options('*', (req, res) => res.sendStatus(204));

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Private routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/me', authenticate, authController.updateCurrentUser);

// Admin-only route
router.get('/admin/users', authenticate, authorize('admin'), authController.getAllUsers);

module.exports = router;