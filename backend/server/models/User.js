const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character']
    },
    role: {
        type: String,
        enum: ['candidate', 'hr', 'admin'],
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

// Add method to check if user has required role
userSchema.methods.hasRole = function(role) {
    if (this.role === 'admin') return true;
    return this.role === role;
};

module.exports = mongoose.model('User', userSchema);