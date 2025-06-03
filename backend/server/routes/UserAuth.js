const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authenticate, authorize } = require('../middleware/Auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', authController.refreshToken);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, authController.logout);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, authController.getCurrentUser);

// @route   PUT api/auth/me
// @desc    Update current user
// @access  Private
router.put('/me', authenticate, authController.updateCurrentUser);

// @route   GET api/auth/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/admin/users', authenticate, authorize('admin'), authController.getAllUsers);

module.exports = router;