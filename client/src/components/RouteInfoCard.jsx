import { ShieldCheck, Clock, Ruler, AlertTriangle, X } from "lucide-react";

const LABEL_COLORS = {
  Safe: "text-risk-safe",
  Moderate: "text-risk-moderate",
  "High Risk": "text-risk-high",
};

const LABEL_BG = {
  Safe: "bg-risk-safe/10",
  Moderate: "bg-risk-moderate/10",
  "High Risk": "bg-risk-high/10",
};

export default function RouteInfoCard({ route, onClose, onViewRoute }) {
  if (!route) return null;

  const { destination, distanceKm, etaMin, safety, nearbyCount } = route;
  const labelColor = LABEL_COLORS[safety.label] || "text-accent";
  const labelBg = LABEL_BG[safety.label] || "bg-accent/10";

  return (
    <div className="pointer-events-auto w-full max-w-sm bg-base-900/95 backdrop-blur border border-base-700 rounded-xl2 shadow-panel p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: "#5c6675" }}>
            Route to
          </p>
          <h3 className="text-base font-semibold text-white mt-0.5">{destination}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-base-600 hover:text-white transition-colors"
          style={{ color: "#5c6675" }}
        >
          <X size={16} />
        </button>
      </div>

      <div className={`flex items-center justify-between rounded-xl p-3.5 mb-4 ${labelBg}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className={labelColor} />
          <span className={`text-sm font-medium ${labelColor}`}>{safety.label}</span>
        </div>
        <span className={`text-2xl font-bold ${labelColor}`}>
          {safety.score}
          <span className="text-sm font-medium" style={{ color: "#8b96a5" }}>
            /100
          </span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat icon={Ruler} label="Distance" value={`${distanceKm} km`} />
        <Stat icon={Clock} label="ETA" value={`${etaMin} min`} />
        <Stat icon={AlertTriangle} label="Incidents" value={nearbyCount} />
      </div>

      <button
        onClick={onViewRoute}
        className="w-full bg-accent text-base-950 font-semibold text-sm rounded-lg py-2.5 hover:bg-accent-dim transition-colors"
      >
        View Safer Route
      </button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-base-800 border border-base-700 rounded-lg py-2.5 flex flex-col items-center gap-1">
      <Icon size={14} style={{ color: "#8b96a5" }} />
      <span className="text-sm font-semibold text-white">{value}</span>
      <span className="text-[10px]" style={{ color: "#5c6675" }}>
        {label}
      </span>
    </div>
  );
}
