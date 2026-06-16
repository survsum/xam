const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
    },

    examCode: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);