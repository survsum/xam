const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      trim: true,
    },

    examCode: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    originalFileName: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    mimeType: {
      type: String,
      default: "application/pdf",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    iv: {
      type: String,
      required: true,
    },

    unlockTime: {
      type: Date,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["locked", "unlocked"],
      default: "locked",
    },

    blockchainStatus: {
      type: String,
      enum: ["registered", "pending", "offline", "failed"],
      default: "pending",
    },

    blockchainTxHash: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);