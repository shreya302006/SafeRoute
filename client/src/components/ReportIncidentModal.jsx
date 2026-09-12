import { useState } from "react";
import { X, MapPin } from "lucide-react";

const CATEGORIES = [
  { value: "theft", label: "Theft" },
  { value: "harassment", label: "Harassment" },
  { value: "assault", label: "Assault" },
  { value: "poor_lighting", label: "Poor Lighting" },
  { value: "accident", label: "Accident" },
  { value: "suspicious_activity", label: "Suspicious Activity" },
  { value: "other", label: "Other" },
];

const SEVERITIES = ["low", "medium", "high"];

export default function ReportIncidentModal({ userLocation, onClose, onSubmit, submitting }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [severity, setSeverity] = useState("low");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !userLocation) return;
    onSubmit?.({
      title,
      category,
      severity,
      description,
      latitude: userLocation[0],
      longitude: userLocation[1],
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-base-900 border border-base-700 rounded-xl2 shadow-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Report an incident</h2>
          <button onClick={onClose} style={{ color: "#8b96a5" }} className="hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b96a5" }}>
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Poorly lit alley"
              required
              className="w-full bg-base-800 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-base-600 outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b96a5" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-base-800 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b96a5" }}>
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-base-800 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#8b96a5" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened?"
              rows={3}
              className="w-full bg-base-800 border border-base-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-base-600 outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs rounded-lg bg-base-800 border border-base-700 px-3 py-2.5" style={{ color: "#8b96a5" }}>
            <MapPin size={14} className="text-accent shrink-0" />
            {userLocation
              ? `Using your current location (${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)})`
              : "Location unavailable — enable geolocation to report"}
          </div>

          <button
            type="submit"
            disabled={submitting || !userLocation}
            className="w-full bg-accent text-base-950 font-semibold text-sm rounded-lg py-2.5 hover:bg-accent-dim transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
