const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const dotenv = require('dotenv');

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

// Ensure required upload directories exist synchronously on startup
const uploadDir = path.join(__dirname, 'uploads');
const decryptedDir = path.join(uploadDir, 'decrypted');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(decryptedDir)) {
  fs.mkdirSync(decryptedDir, { recursive: true });
}

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
    message: 'PerfectXams API running',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: "File is too large. Maximum size is 25MB." });
  }
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server. Please try again."
  });
});

// MongoDB Connection + Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/perfectxams")
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`PerfectXams Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });