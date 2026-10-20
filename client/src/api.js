const API_BASE_URL = "http://localhost:5000/api";

export async function checkBackend() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error("Backend connection failed");
    }
    return response.json();
}