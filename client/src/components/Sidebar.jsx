import {
  Home,
  Compass,
  ShieldAlert,
  MapPinned,
  ClipboardList,
  Settings,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
  { label: "Report Incident", icon: ShieldAlert },
  { label: "Safety Map", icon: MapPinned },
  { label: "My Reports", icon: ClipboardList },
  { label: "Settings", icon: Settings },
];

export default function Sidebar({ activeItem, onSelect }) {
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-base-900 border-r border-base-700 px-5 py-6 shrink-0">
      <div className="flex items-center gap-2.5 px-2 mb-9">
        <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
          <ShieldCheck size={20} className="text-accent" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">
          SafeRoute
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = label === activeItem;
          return (
            <button
              key={label}
              onClick={() => onSelect?.(label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-base-600 hover:text-white hover:bg-base-800"
              }`}
              style={isActive ? {} : { color: "#8b96a5" }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-base-700">
        <div className="rounded-xl2 bg-base-800 p-4">
          <p className="text-xs text-base-600" style={{ color: "#8b96a5" }}>
            Crowd reports today
          </p>
          <p className="text-2xl font-bold text-white mt-1">128</p>
          <p className="text-xs mt-1" style={{ color: "#5c6675" }}>
            from your community
          </p>
        </div>
      </div>
    </aside>
  );
}
