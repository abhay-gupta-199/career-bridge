const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  // Skill breakdown
  matchedSkills: [{
    type: String,
    trim: true
  }],
  unmatchedSkills: [{
    type: String,
    trim: true
  }],
  // Matching method used
  matchMethod: {
    type: String,
    enum: ["simple", "ml-semantic"],
    default: "simple"
  },
  // ML Scoring Details
  semanticScore: {
    type: Number,
    min: 0,
    max: 1
  },
  tfidfScore: {
    type: Number,
    min: 0,
    max: 1
  },
  hybridScore: {
    type: Number,
    min: 0,
    max: 1
  },
  // Notification status
  isRead: {
    type: Boolean,
    default: false
  },
  // Notification type
  type: {
    type: String,
    enum: ["job_match", "application_status", "general"],
    default: "job_match"
  },
  // Student action status
  studentAction: {
    type: String,
    enum: ["not_applied", "applied", "rejected"],
    default: "not_applied"
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ student: 1, createdAt: -1 });
notificationSchema.index({ student: 1, isRead: 1 });
notificationSchema.index({ job: 1 });

module.exports = mongoose.model("Notification", notificationSchema);

