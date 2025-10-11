const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const College = require('../models/College');
const Owner = require('../models/Owner');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
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
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
