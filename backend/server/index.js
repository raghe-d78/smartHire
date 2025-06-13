// server/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const JobRoutes = require('./routes/Job');
const ApplicationRoutes = require('./routes/Application');
const AuthRoutes = require('./routes/UserAuth');
const candidateRoutes = require('./routes/CandidateRoutes');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes

app.use('/api/jobs', JobRoutes);
app.use('/api/applications', ApplicationRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/candidates', candidateRoutes);


// Test route
app.get('/', (req, res) => res.send('SmartHire API Running'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));