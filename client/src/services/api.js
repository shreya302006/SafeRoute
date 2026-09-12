// Central place for all backend API calls. Components should import from
// here rather than calling fetch() directly, so the API layer can be
// swapped out or extended (auth headers, retries, real routing API, etc.)
// without touching UI code.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export function getAllIncidents() {
  return request("/api/incidents");
}

export function getNearbyIncidents({ lat, lng, distance = 2000 }) {
  return request(`/api/incidents/nearby?lat=${lat}&lng=${lng}&distance=${distance}`);
}

export function reportIncident(incident) {
  return request("/api/incidents", {
    method: "POST",
    body: JSON.stringify(incident),
  });
}
