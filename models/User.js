const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  college: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  passout_year: { type: Number, required: true },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
