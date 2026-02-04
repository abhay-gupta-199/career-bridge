const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userRole'
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    userRole: {
        type: String,
        enum: ["Student", "College", "Owner"],
        default: "Student"
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending"
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
feedbackSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
