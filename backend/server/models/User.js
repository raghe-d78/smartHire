// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ]
    },
    role: {
        type: String,
        enum: ['candidate', 'rh', 'admin'],
        default: 'candidate'
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Method to check user role
userSchema.methods.hasRole = function(role) {
    if (this.role === 'admin') return true;
    return this.role === role;
};

module.exports = mongoose.model('User', userSchema);