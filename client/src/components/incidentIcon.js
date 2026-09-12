import L from "leaflet";

const SEVERITY_COLOR = {
  low: "#f2b84b",
  medium: "#f2914b",
  high: "#f2555a",
};

// Builds a small circular divIcon so we don't depend on external marker
// image assets (which are notoriously fiddly with Leaflet + bundlers).
export function incidentIcon(severity = "low") {
  const color = SEVERITY_COLOR[severity] || SEVERITY_COLOR.low;

  return L.divIcon({
    className: "",
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${color};
      border:2px solid #0f141c;
      box-shadow:0 0 0 3px ${color}33;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

export function userIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:#3dd9c4;
      border:3px solid #0a0e14;
      box-shadow:0 0 0 4px #3dd9c433;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
