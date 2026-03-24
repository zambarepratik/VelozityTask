import { useState, useRef } from "react";
import { useTaskStore } from "../store/useTaskStore";

const ROW_HEIGHT = 60;
const BUFFER = 5;

export default function ListView() {
  const { tasks = [], moveTask } = useTaskStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [sortBy, setSortBy] = useState("title");
  const [asc, setAsc] = useState(true);

  // ✅ PRIORITY ORDER FIX (IMPORTANT)
  const priorityOrder: any = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  // ✅ SORT
  const sortedTasks = [...tasks].sort((a: any, b: any) => {
    if (sortBy === "title") {
      return asc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    if (sortBy === "priority") {
      return asc
        ? priorityOrder[b.priority] - priorityOrder[a.priority]
        : priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });

  // ✅ VIRTUAL SCROLL (SMOOTH FIX)
  const total = sortedTasks.length;

  const containerHeight = 500; // fixed height for smoothness
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
  );

  const endIndex = Math.min(
    total,
    startIndex + visibleCount + BUFFER * 2
  );

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) setAsc(!asc);
    else {
      setSortBy(field);
      setAsc(true);
    }
  };

  // ✅ COLORS
  const priorityColor = (p?: string) => {
    const val = (p || "").toLowerCase();

    switch (val) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300";
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "todo":
        return "bg-gray-400 text-white";
      case "inprogress":
        return "bg-blue-500 text-white";
      case "review":
        return "bg-purple-500 text-white";
      case "done":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="p-5 h-[85vh] flex flex-col">

      <h2 className="text-xl font-bold mb-4">📋 Task List</h2>

      {/* SCROLL CONTAINER */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-auto bg-white rounded-2xl shadow border flex-1 relative"
        style={{ height: containerHeight }}
      >
        {/* TOTAL HEIGHT */}
        <div style={{ height: total * ROW_HEIGHT, position: "relative" }}>

          {/* VISIBLE AREA */}
          <div
            style={{ transform: `translateY(${offsetY}px)` }}
            className="absolute left-0 right-0"
          >

            {/* HEADER */}
            <div className="grid grid-cols-4 bg-gray-100 sticky top-0 z-10 text-sm font-semibold text-gray-700 border-b">
              <div
                onClick={() => handleSort("title")}
                className="p-3 cursor-pointer hover:text-blue-600"
              >
                Title {sortBy === "title" && (asc ? "↑" : "↓")}
              </div>

              <div
                onClick={() => handleSort("priority")}
                className="p-3 cursor-pointer hover:text-blue-600"
              >
                Priority {sortBy === "priority" && (asc ? "↑" : "↓")}
              </div>

              <div className="p-3">Status</div>
              <div className="p-3">User</div>
            </div>

            {/* ROWS */}
            {visibleTasks.map((task: any) => (
              <div
                key={task.id}
                className="grid grid-cols-4 items-center border-b h-[60px] px-3 hover:bg-gray-50 transition"
              >
                {/* TITLE */}
                <div className="font-medium text-gray-800 truncate">
                  {task.title}
                </div>

                {/* PRIORITY */}
                <div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${priorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority?.toUpperCase()}
                  </span>
                </div>

                {/* STATUS BUTTONS */}
                <div className="flex gap-2 flex-wrap">
                  {["todo", "inprogress", "review", "done"].map((s) => (
                    <button
                      key={s}
                      onClick={() => moveTask(task.id, s)}
                      className={`px-2 py-1 text-xs rounded-full transition
                      ${
                        task.status === s
                          ? statusColor(s)
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* USER */}
                <div>
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs font-bold">
                    {task.assignee || "U"}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}