const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health-check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BLOCK BLITZ backend is running!",
  });
});

// Save game result (temporary: memory only)
app.post("/api/Score", (req, res) => {
  const { score, bestScore } = req.body;
  if (typeof score !== "number" || score < 0 || bestScore < 0) {
    return res.status(400).json({
      success: false,
      message: "Valid score and bestScore are requied.",
    });
  }
  res.json({
    success: true,
    message: "Game result recieved successfully!",
    result: { score, bestScore },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`BLOCK BLITZ backend running on port ${PORT}`);
});
