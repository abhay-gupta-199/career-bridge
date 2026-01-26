const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    // Singleton identifier - always use 'admin' as key
    key: {
        type: String,
        default: "admin",
        unique: true
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light"
    },
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        },
        inApp: {
            type: Boolean,
            default: true
        }
    },
    systemConfig: {
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        apiKey: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Settings", settingsSchema);
