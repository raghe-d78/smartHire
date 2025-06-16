require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Initialize express app
const app = express();

// Enable CORS for all origins and handle credentials if needed
const corsOptions = {
    origin: (origin, callback) => {
        // Allow all origins, including mobile apps or curl with no origin
        callback(null, true);
    },
    credentials: true, // Allow cookies and auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected: ${conn.connection.host}");
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./server/routes/UserAuth'));
app.use('/api/candidates', require('./server/routes/CandidateRoutes'));
app.use('/api', require('./server/routes/UploadRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});