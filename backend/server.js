// Add these near other middleware
app.use(express.json());
app.use('/api/auth', require('./server/routes/UserAuth'));