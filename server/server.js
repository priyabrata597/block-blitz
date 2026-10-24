const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const GameResult = require("./GameResult");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) =>
    console.log("MongoDB connection error:", error.message)
  );

app.use(cors());
app.use(express.json());

// Health-check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BLOCK BLITZ backend is running!",
  });
});

// Save game result
app.post("/api/Score", async (req, res) => {
  try {
    const { playerName = "Player", score, bestScore } = req.body;

    if (
      typeof playerName !== "string" ||
      !playerName.trim() ||
      typeof score !== "number" ||
      !Number.isFinite(score) ||
      score < 0 ||
      typeof bestScore !== "number" ||
      !Number.isFinite(bestScore) ||
      bestScore < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid playerName, score and bestScore are required.",
      });
    }

    const result = await GameResult.create({
      playerName: playerName.trim(),
      score,
      bestScore,
    });

    return res.status(201).json({
      success: true,
      message: "Game result saved successfully!",
      result,
    });
  } catch (error) {
    console.error("Error saving game result:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save game result.",
    });
  }
});

// Dashboard statistics
app.get("/api/dashboard", async (req, res) => {
  try {
    const playerName =
      typeof req.query.playerName === "string"
        ? req.query.playerName.trim()
        : "";

    if (!playerName) {
      return res.status(400).json({
        success: false,
        message: "Player name is required.",
      });
    }

    const results = await GameResult.find({ playerName }).select(
      "score bestScore"
    );

    const totalGames = results.length;
    const bestScore = results.reduce(
      (highest, result) => Math.max(highest, result.bestScore, result.score),
      0
    );

    return res.json({
      success: true,
      playerName,
      totalGames,
      bestScore,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`BLOCK BLITZ backend running on port ${PORT}`);
});