const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http:localhost:5000/api").replace(/\/+$/,"");

// Get the saved authentication token
function getAuthHeaders() {
  const token = localStorage.getItem("blockBlitzToken");

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Read an API response and report meaningful errors
async function readResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

// Check backend availability
export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/health`);

  return readResponse(response, "Backend connection failed.");
}

// Submit a game result for the logged-in user
export async function submitGameResult(score) {
  const response = await fetch(`${API_BASE_URL}/Score`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score,
    }),
  });

  // return readResponse(response, "Failed to submit game result.");

  const data = await readResponse( response, "Failed to submit game reault.",);
  console.log("Saved game result:", data.result);
  return data;
}

// Load dashboard statistics for the logged-in user
export async function getDashboard() {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response, "Failed to load dashboard.");
}

// Load the public global leaderboard
export async function getLeaderboard() {
  const response = await fetch(`${API_BASE_URL}/leaderboard`);

  return readResponse(response, "Failed to load leaderboard.");
}

// Register a new account
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  return readResponse(response, "Registration failed.");
}

// Log in to an existing account
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return readResponse(response, "Login failed.");
}

// Get the currently authenticated user
export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readResponse(response, "Unable to retrieve user.");
}