const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log(`📡 Environment: ${process.env.NODE_ENV || 'dev'}`);
if (!MONGO_URI) {
  console.warn('⚠️ MONGO_URI not found in process.env');
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const teamRoutes = require('./routes/teamRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', teamRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets in production (Only if not handled by Vercel)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
} else {
  // Health check
  app.get('/', (req, res) => {
    res.json({ message: 'HACKATHON-26 API is running 🚀' });
  });
}

// Connect to MongoDB
console.log('🔗 Attempting to connect to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    // Only listen if not in a serverless environment (Vercel)
    if (!process.env.VERCEL) {
      app.listen(PORT, () => console.log(`🚀 Production Server running on port ${PORT}`));
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (!process.env.VERCEL) process.exit(1);
  });

module.exports = app;
