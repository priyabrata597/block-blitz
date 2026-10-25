const API_BASE_URL = "http://localhost:5000/api";

export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend connection failed");
  }

  return response.json();
}

export async function submitGameResult(
  playerName,
  score,
  bestScore
) {
  const response = await fetch(`${API_BASE_URL}/Score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerName,
      score,
      bestScore,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit game result");
  }

  return response.json();
}

export async function getDashboard(playerName) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard?playerName=${encodeURIComponent(playerName)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json();
}

export async function getLeaderboard() {
  const response = await fetch(`${API_BASE_URL}/leaderboard`);

  if (!response.ok) {
    throw new Error("Failed to load leaderboard");
  }

  return response.json();
}