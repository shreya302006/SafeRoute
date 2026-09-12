import mongoose from "mongoose";

// Categories and severities are kept as free-text enums here so the list
// can be extended later without a migration.
const CATEGORIES = [
  "theft",
  "harassment",
  "assault",
  "poor_lighting",
  "accident",
  "suspicious_activity",
  "other",
];

const SEVERITIES = ["low", "medium", "high"];

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "other",
    },
    severity: {
      type: String,
      enum: SEVERITIES,
      default: "low",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    // GeoJSON Point - required for MongoDB geospatial queries ($near, $geoWithin, etc.)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        // [longitude, latitude]  -- GeoJSON order, NOT [lat, lng]
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// 2dsphere index enables $near / $geoNear geospatial queries on `location`
incidentSchema.index({ location: "2dsphere" });

incidentSchema.statics.CATEGORIES = CATEGORIES;
incidentSchema.statics.SEVERITIES = SEVERITIES;

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
