const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const College = require('../models/College');
const Owner = require('../models/Owner');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Make sure header starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token format invalid' });
    }

    const token = authHeader.split(' ')[1]; // extract actual token
    if (!token) {
      return res.status(401).json({ message: 'Token is empty' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Token is not valid or expired' });
    }

    // Find user based on role
    let user;
    switch (decoded.role) {
      case 'student':
        user = await Student.findById(decoded.userId).select('-password');
        break;
      case 'college':
        user = await College.findById(decoded.userId).select('-password');
        break;
      case 'owner':
        user = await Owner.findById(decoded.userId).select('-password');
        break;
      default:
        return res.status(401).json({ message: 'Invalid token role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found for this token' });
    }

    req.user = user;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
