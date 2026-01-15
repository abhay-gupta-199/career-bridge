const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    target: {
        type: String,
        enum: ["all", "students", "colleges"],
        default: "all"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true
    },
    status: {
        type: String,
        enum: ["sent", "failed", "draft"],
        default: "sent"
    }
}, {
    timestamps: true
});

announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ target: 1 });

module.exports = mongoose.model("Announcement", announcementSchema);
