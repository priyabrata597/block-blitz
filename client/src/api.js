const API_BASE_URL = "http://localhost:5000/api";

export async function checkBackend() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error("Backend connection failed");
    }
    return response.json();
}

export async function submitGameResult(score, bestScore) {
    const response = await
    fetch ("http://localhost:5000/api/score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, bestScore}),
    });

    if (!response.ok) {
        throw new Error("Failed to submit game result");
    }
    return response.json();
}