const mongoose = require("mongoose");

const adminBroadcastSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    target: {
        type: String,
        enum: ["all", "student", "college"],
        default: "all"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
adminBroadcastSchema.index({ createdAt: -1 });
adminBroadcastSchema.index({ target: 1 });

module.exports = mongoose.model("AdminBroadcast", adminBroadcastSchema);
