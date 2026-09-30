const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
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

  foundDate: {
    type: Date,
    required: true
  },

  foundLocation: {
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
    enum: ["available", "matched", "returned", "closed"],
    default: "available"
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("FoundItem", foundItemSchema);