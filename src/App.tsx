import { useState } from "react";
import KanbanBoard from "./views/KanbanBoard";
import ListView from "./views/ListView";
import TimelineView from "./views/TimelineView";

function App() {
  const [view, setView] = useState("kanban");

  return (
    <div className="h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-white p-4 shadow flex justify-between items-center">
        <h1 className="font-bold text-2xl">🚀 Project Tracker</h1>

        {/* View Switch */}
        <div className="flex gap-2">
          {["kanban", "list", "timeline"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1 rounded-full capitalize transition
              ${
                view === v
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Views */}
      <div className="flex-1 overflow-hidden">

        {view === "kanban" && <KanbanBoard />}

        {view === "list" && <ListView />}

        {view === "timeline" && <TimelineView />}

      </div>

    </div>
  );
}

export default App;