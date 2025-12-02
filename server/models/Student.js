const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  skills: [{
    type: String,
    trim: true
  }],
  resume: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    trim: true
  },
  graduationYear: {
    type: Number
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedCompany: {
    type: String,
    trim: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedAt: {
    type: Date,
    default: null
  },
  blockReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
