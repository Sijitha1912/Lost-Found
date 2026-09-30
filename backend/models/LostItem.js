const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },

  brand: {
    type: String
  },

  model: {
    type: String
  },

  color: {
    type: String,
    required: true
  },

  lostDate: {
    type: Date,
    required: true
  },

  lostLocation: {
    type: String,
    required: true
  },

  photo: {
    type: String
  },

  identifyingMarks: {
    type: String
  },

  description: {
    type: String
  },

  status: {
    type: String,
    enum: ["searching", "matched", "returned", "closed"],
    default: "searching"
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("LostItem", lostItemSchema);