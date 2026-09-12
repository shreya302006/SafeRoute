import { useState } from "react";
import { Search, MapPin, Navigation2, ArrowRightLeft } from "lucide-react";

export default function SearchPanel({ onFindRoute, loading }) {
  const [from, setFrom] = useState("Current Location");
  const [to, setTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!to.trim()) return;
    onFindRoute?.({ from, to });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pointer-events-auto w-full max-w-md bg-base-900/95 backdrop-blur border border-base-700 rounded-xl2 shadow-panel p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Search size={16} className="text-accent" />
        <span className="text-sm font-semibold text-white">Find a safe route</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-base-800 border border-base-700 rounded-lg px-3 py-2.5">
          <Navigation2 size={15} className="text-accent shrink-0" />
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="bg-transparent outline-none text-sm text-white placeholder-base-600 w-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-base-800 border border-base-700 rounded-lg px-3 py-2.5">
          <MapPin size={15} className="text-risk-high shrink-0" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To — where are you headed?"
            className="bg-transparent outline-none text-sm text-white placeholder-base-600 w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-accent text-base-950 font-semibold text-sm rounded-lg py-2.5 hover:bg-accent-dim transition-colors disabled:opacity-60"
      >
        <ArrowRightLeft size={14} />
        {loading ? "Finding route..." : "Find Safe Route"}
      </button>
    </form>
  );
}
