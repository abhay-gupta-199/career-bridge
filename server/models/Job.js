const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  parsedSkills: [{
    type: String,
    trim: true
  }],
  requirements: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: "INR"
    }
  },
  experience: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number
    }
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    default: "Full-time"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true
  },
  postedByCollege: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    default: null
  },
  createdByType: {
    type: String,
    enum: ["owner", "college"],
    default: "owner"
  },
  applications: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Accepted", "Rejected"],
      default: "Applied"
    }
  }]
  ,
  matches: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    matchPercentage: { type: Number, default: 0 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    method: { type: String },
    semanticScore: { type: Number },
    tfidfScore: { type: Number },
    hybridScore: { type: Number },
    calculatedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);
