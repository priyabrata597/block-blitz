const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    default: "Player",
  },

  score: {
    type: Number,
    required: true,
    min: 0,
  },

  bestScore: {
    type: Number,
    required: true,
    min: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GameResult", gameResultSchema);