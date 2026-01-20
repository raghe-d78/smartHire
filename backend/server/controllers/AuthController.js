const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Candidate = require('../models/CandidateModel');

// Generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET, { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign({ id: user._id },
        process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};
// User Registration
exports.register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Validate role if provided - FIXED: changed 'hr' to 'rh' to match User model
        if (role && !['candidate', 'rh', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'candidate'
        });

        await user.save();
        // Register candidate profile
        if (user.role === 'candidate') {
            const candidateProfile = new Candidate({
                userId: user._id,
                cvUrl: '',
                portfolio: '',
                personalityInsights: '',
                applications: [],
                headline: '',
                location: '',
                experience: [],
                skills: [],
                about: '',
                education: [],
                certificates: []
            });
            await candidateProfile.save();
        } // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// User Login
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Update user's refresh token and last login
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Refresh Token
exports.refreshToken = async(req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new tokens
        const tokens = generateTokens(user);
        // Update user's refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Logout
exports.logout = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; // Get Current User
exports.getCurrentUser = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
<<<<<<< HEAD
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        // Return id as 'id' (not '_id') for client compatibility
        res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        });
=======
        res.json(user);
>>>>>>> 86dd29be17044e90d3365fbe5ea4ec20688f2573
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateCurrentUser = async(req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) {
            // Check if email is already taken
            const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            updates.email = email;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id, { $set: updates }, { new: true }
        ).select('-password -refreshToken');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get All Users (Admin only)
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};