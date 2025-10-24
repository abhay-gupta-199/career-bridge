const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost';
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, mobile clients)
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return callback(null, true);
    } catch (err) {}
    if (origin === CLIENT_ORIGIN) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10 * 60 * 1000, sameSite: 'lax' } // 10 minutes
}));

// ✅ Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/owner', ownerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Career Bridge API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
