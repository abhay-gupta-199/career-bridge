require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// ====== Config ======
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerbridge';
const SESSION_SECRET = process.env.SESSION_SECRET || 'careerbridge_secret';
const PORT = process.env.PORT || 5000;

// ====== DB Connect ======
mongoose.connect(MONGO_URI, { })
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ====== Middleware ======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions (must be before routes)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
  }
}));

// Make auth state available to views
app.use((req, res, next) => {
  res.locals.isAuthenticated = Boolean(req.session.userId);
  next();
});

// Static + Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ====== Routes ======
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/resume', resumeRoutes);

// ====== Start ======
app.listen(PORT, () => {
  console.log(`✅ Career Bridge running at http://localhost:${PORT}`);
});
