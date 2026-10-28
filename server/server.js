const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const GameResult = require("./GameResult");

const User = require("./User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Verify authentication token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}

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

// User registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 40 ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid name and email, and a password between 8 and 72 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create the account.",
    });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {userId: user._id.toString() },
      process.env.JWT_SECRET, 
      {expiresIn: "2h"}
    );

    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});

// Get the currently authenticated user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "_id name email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Current-user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user details.",
    });
  }
});

// Health-check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BLOCK BLITZ backend is running!",
  });
});

// Save a game result for the authenticated user
app.post("/api/Score", authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;

    if (
      typeof score !== "number" ||
      !Number.isSafeInteger(score) ||
      score < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid non-negative game score is required.",
      });
    }

    const user = await User.findById(req.userId).select("name");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found. Please log in again.",
      });
    }

    const previousResults = await GameResult.find({
      userId: user._id,
    }).select("score bestScore");

    const previousBest = previousResults.reduce(
      (highest, result) =>
        Math.max(highest, result.score, result.bestScore),
      0
    );

    const bestScore = Math.max(previousBest, score);

    const result = await GameResult.create({
      userId: user._id,
      playerName: user.name,
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

// Dashboard statistics for the authenticated user
app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found. Please log in again.",
      });
    }

    const results = await GameResult.find({
      userId: user._id,
    }).select("score bestScore");

    const totalGames = results.length;

    const bestScore = results.reduce(
      (highest, result) =>
        Math.max(highest, result.score, result.bestScore),
      0
    );

    return res.json({
      success: true,
      playerName: user.name,
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

// Global leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await GameResult.aggregate([
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$playerName" } } },
          playerName: { $first: "$playerName" },
          bestScore: {
            $max: { $max: ["$score", "$bestScore"] }
          }
        }
      },
      {
        $sort: { bestScore: -1, playerName: 1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          playerName: 1,
          bestScore: 1
        }
      }
    ]);

    return res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error("Error loading leaderboard:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load leaderboard."
    });
  }
});

app.listen(PORT, () => {
  console.log(`BLOCK BLITZ backend running on port ${PORT}`);
});