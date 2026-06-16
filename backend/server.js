const express = require('express');
const mongoose = require('mongoose');

const dns = require('dns');
const dotenv = require('dotenv');

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/paperRoutes');

const app = express();


// Middleware
const cors = require("cors");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);


// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PerfectXskills API running',
  });
});


// MongoDB Connection + Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });