// Run with: npm run seed
// Populates the database with realistic demo incidents around a default
// city center so the map has something to show immediately.
import mongoose from "mongoose";
import dotenv from "dotenv";
import Incident from "../models/Incident.js";

dotenv.config();

// Default center: San Francisco. Change to any city — the frontend's
// default map center should match (see client/src/App.jsx).
const CENTER = { lat: 37.7749, lng: -122.4194 };

const jitter = (base, spread = 0.02) => base + (Math.random() - 0.5) * spread;

const demoIncidents = [
  {
    title: "Bag snatching reported near market",
    category: "theft",
    severity: "high",
    description: "A pedestrian reported their bag was grabbed while walking near the market entrance.",
  },
  {
    title: "Poor street lighting on side street",
    category: "poor_lighting",
    severity: "medium",
    description: "Several streetlights have been out for over a week, making the sidewalk very dark at night.",
  },
  {
    title: "Verbal harassment reported",
    category: "harassment",
    severity: "medium",
    description: "A passerby reported being verbally harassed near the bus stop in the evening.",
  },
  {
    title: "Minor traffic accident",
    category: "accident",
    severity: "low",
    description: "A minor fender-bender was reported at this intersection; traffic briefly slowed.",
  },
  {
    title: "Suspicious individual loitering",
    category: "suspicious_activity",
    severity: "low",
    description: "Residents reported someone loitering near parked cars for an extended period.",
  },
  {
    title: "Attempted phone theft",
    category: "theft",
    severity: "high",
    description: "An attempted phone snatching was reported near the cafe on the corner.",
  },
  {
    title: "Unsafe pedestrian crossing",
    category: "accident",
    severity: "medium",
    description: "The crosswalk signal is malfunctioning, creating a hazard for pedestrians.",
  },
  {
    title: "Group disturbance late at night",
    category: "suspicious_activity",
    severity: "medium",
    description: "A noisy group gathering was reported causing minor disturbances late at night.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await Incident.deleteMany({});

    const docs = demoIncidents.map((incident) => ({
      ...incident,
      location: {
        type: "Point",
        coordinates: [jitter(CENTER.lng), jitter(CENTER.lat)],
      },
    }));

    await Incident.insertMany(docs);
    console.log(`Seeded ${docs.length} demo incidents.`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
