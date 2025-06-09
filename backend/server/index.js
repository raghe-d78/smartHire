// server/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const candidateRoutes = require('./routes/Condidate');
const jobRoutes = require('./routes/Job');
const applicationRoutes = require('./routes/Application');
const AuthRoutes = require('./routes/UserAuth');
const app = express();

// Connexion à la base MongoDB
connectDB();

app.use(express.json());

// Routes

app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth/', AuthRoutes);


// Test route
app.get('/', (req, res) => res.send('SmartHire API Running'));

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));