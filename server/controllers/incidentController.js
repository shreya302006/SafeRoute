import Incident from "../models/Incident.js";
import { calculateSafetyScore } from "../utils/safetyScore.js";

// GET /api/incidents
export async function getAllIncidents(req, res) {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
}

// GET /api/incidents/nearby?lat=..&lng=..&distance=..
// Uses MongoDB's native geospatial query ($nearSphere) instead of
// calculating distances manually in JavaScript.
export async function getNearbyIncidents(req, res) {
  try {
    const { lat, lng, distance = 2000 } = req.query; // distance in meters

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng query params are required" });
    }

    const incidents = await Incident.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance, 10),
        },
      },
    });

    const safety = calculateSafetyScore(incidents);

    res.json({ incidents, count: incidents.length, safety });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nearby incidents" });
  }
}

// POST /api/incidents
export async function createIncident(req, res) {
  try {
    const { title, category, severity, description, latitude, longitude } = req.body;

    if (!title || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "title, latitude and longitude are required" });
    }

    const incident = await Incident.create({
      title,
      category,
      severity,
      description,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    res.status(201).json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create incident" });
  }
}
