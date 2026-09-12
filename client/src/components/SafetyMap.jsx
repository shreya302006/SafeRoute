import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import { incidentIcon, userIcon } from "./incidentIcon";

const SEVERITY_LABEL = { low: "Low", medium: "Medium", high: "High" };
const CATEGORY_LABEL = {
  theft: "Theft",
  harassment: "Harassment",
  assault: "Assault",
  poor_lighting: "Poor Lighting",
  accident: "Accident",
  suspicious_activity: "Suspicious Activity",
  other: "Other",
};

// Keeps the map view in sync when the center prop changes programmatically
// (e.g. after geolocation resolves or a route is found).
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function SafetyMap({
  center,
  zoom = 14,
  incidents = [],
  userLocation,
  routeLine,
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <RecenterMap center={center} />

      {userLocation && (
        <Marker position={userLocation} icon={userIcon()}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {incidents.map((incident) => {
        const [lng, lat] = incident.location.coordinates;
        return (
          <Marker
            key={incident._id}
            position={[lat, lng]}
            icon={incidentIcon(incident.severity)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{incident.title}</p>
                <p className="text-xs mt-1">
                  {CATEGORY_LABEL[incident.category] || incident.category} ·{" "}
                  {SEVERITY_LABEL[incident.severity] || incident.severity} severity
                </p>
                {incident.description && (
                  <p className="text-xs mt-1.5">{incident.description}</p>
                )}
                <p className="text-[11px] mt-1.5 opacity-70">
                  Reported {new Date(incident.createdAt).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {routeLine && <Polyline positions={routeLine} pathOptions={{ color: "#3dd9c4", weight: 4 }} />}
    </MapContainer>
  );
}
