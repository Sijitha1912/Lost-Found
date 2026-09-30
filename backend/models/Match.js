const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  lostItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LostItem",
    required: true
  },

  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoundItem",
    required: true
  },

  matchScore: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["possible", "verified", "rejected"],
    default: "possible"
  },

  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Match", matchSchema);