import { Router } from "express";
import {
  getAllIncidents,
  getNearbyIncidents,
  createIncident,
} from "../controllers/incidentController.js";

const router = Router();

// Order matters: /nearby must be declared before any /:id style route
// is added later, so it isn't shadowed.
router.get("/nearby", getNearbyIncidents);
router.get("/", getAllIncidents);
router.post("/", createIncident);

export default router;
