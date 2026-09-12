import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activeItem, setActiveItem] = useState("Safety Map");

  return (
    <div className="flex w-screen h-screen bg-base-950 overflow-hidden">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />
      <main className="flex-1 relative">
        <Dashboard />
      </main>
    </div>
  );
}
