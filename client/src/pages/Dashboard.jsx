import { useEffect, useState, useCallback } from "react";
import { Plus, LocateFixed } from "lucide-react";
import SafetyMap from "../components/SafetyMap";
import SearchPanel from "../components/SearchPanel";
import RouteInfoCard from "../components/RouteInfoCard";
import ReportIncidentModal from "../components/ReportIncidentModal";
import { getAllIncidents, getNearbyIncidents, reportIncident } from "../services/api";

// Default center used until browser geolocation resolves (or if denied).
// Matches the center used by server/utils/seedIncidents.js.
const DEFAULT_CENTER = [37.7749, -122.4194];

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load all incidents on mount
  useEffect(() => {
    getAllIncidents()
      .then(setIncidents)
      .catch((err) => console.error("Failed to load incidents:", err.message));
  }, []);

  // Try to get the user's real location for a nicer default experience
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setMapCenter(loc);
      },
      () => {
        // Permission denied or unavailable — silently keep default center
      }
    );
  }, []);

  const handleFindRoute = useCallback(
    async ({ to }) => {
      setRouteLoading(true);
      try {
        const origin = userLocation || DEFAULT_CENTER;
        const result = await getNearbyIncidents({ lat: origin[0], lng: origin[1], distance: 2500 });

        // MVP: distance/time are demo values since no real routing API is
        // wired up yet. Structure is ready to swap in a real routing
        // service (e.g. OSRM, Mapbox Directions) later.
        setRoute({
          destination: to,
          distanceKm: (Math.random() * 6 + 2).toFixed(1),
          etaMin: Math.round(Math.random() * 15 + 8),
          safety: result.safety,
          nearbyCount: result.count,
        });
      } catch (err) {
        console.error("Failed to find route:", err.message);
      } finally {
        setRouteLoading(false);
      }
    },
    [userLocation]
  );

  const handleReportSubmit = useCallback(async (payload) => {
    setSubmitting(true);
    try {
      const created = await reportIncident(payload);
      setIncidents((prev) => [created, ...prev]);
      setShowReportModal(false);
    } catch (err) {
      console.error("Failed to report incident:", err.message);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const recenterOnUser = () => {
    if (userLocation) setMapCenter([...userLocation]);
  };

  return (
    <div className="relative w-full h-full">
      <SafetyMap center={mapCenter} incidents={incidents} userLocation={userLocation} />

      {/* Top search bar */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[500] pointer-events-none px-4 w-full flex justify-center">
        <SearchPanel onFindRoute={handleFindRoute} loading={routeLoading} />
      </div>

      {/* Floating controls, bottom-left */}
      <div className="absolute bottom-6 left-6 z-[500] flex flex-col gap-2">
        <button
          onClick={recenterOnUser}
          title="Recenter on my location"
          className="w-10 h-10 rounded-full bg-base-900/95 backdrop-blur border border-base-700 shadow-panel flex items-center justify-center text-accent hover:bg-base-800 transition-colors"
        >
          <LocateFixed size={18} />
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          title="Report an incident"
          className="w-10 h-10 rounded-full bg-accent shadow-panel flex items-center justify-center text-base-950 hover:bg-accent-dim transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Route info card, right side */}
      {route && (
        <div className="absolute top-5 right-5 z-[500] pointer-events-none hidden lg:block">
          <RouteInfoCard route={route} onClose={() => setRoute(null)} onViewRoute={() => {}} />
        </div>
      )}

      {showReportModal && (
        <ReportIncidentModal
          userLocation={userLocation}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}
