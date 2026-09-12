/**
 * SIMPLE placeholder safety scoring engine.
 *
 * This is intentionally basic for the MVP: it starts at 100 and subtracts
 * points for every nearby incident, weighted by severity. Replace the body
 * of `calculateSafetyScore` later with a more sophisticated model (time of
 * day, incident recency, verified reports, historical trends, etc.) without
 * touching any of the calling code, since the function signature stays the
 * same: (incidents) => { score, label }.
 */

const SEVERITY_WEIGHTS = {
  low: 4,
  medium: 9,
  high: 16,
};

export function calculateSafetyScore(nearbyIncidents = []) {
  let penalty = 0;

  for (const incident of nearbyIncidents) {
    penalty += SEVERITY_WEIGHTS[incident.severity] ?? SEVERITY_WEIGHTS.low;
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));

  let label = "Safe";
  if (score < 50) label = "High Risk";
  else if (score < 80) label = "Moderate";

  return { score, label };
}
