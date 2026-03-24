import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

type Task = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  assignee: string;
  dueDate: string;
};

export default function KanbanBoard() {
  const { tasks = [], moveTask } = useTaskStore();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const getTasks = (status: string): Task[] =>
    tasks.filter((t: Task) => t.status === status);

  // ✅ LEFT BORDER COLOR
  const getPriorityBorder = (p?: string) => {
    const val = (p || "").toLowerCase();

    switch (val) {
      case "critical":
        return "border-l-4 border-red-700";
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-400";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  // ✅ BADGE COLOR
  const getPriorityBadge = (p?: string) => {
    const val = (p || "").toLowerCase();

    switch (val) {
      case "critical":
        return "bg-red-700 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  // ✅ DUE DATE LOGIC
  const getDueLabel = (dateStr: string) => {
    const today = new Date();
    const due = new Date(dateStr);

    const diff = Math.floor(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return { text: "Due Today", color: "text-blue-600" };
    if (diff > 7)
      return { text: `${diff} days overdue`, color: "text-red-600" };
    if (diff > 0) return { text: "Overdue", color: "text-red-500" };

    return {
      text: due.toLocaleDateString(),
      color: "text-gray-500",
    };
  };

  // ✅ TASK CARDS
  const renderTasks = (tasks: Task[]) =>
    tasks.map((task) => {
      const due = getDueLabel(task.dueDate);

      return (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => {
            setDraggingId(task.id);

            const img = new Image();
            img.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMCIgaGVpZ2h0PSIwIj48L3N2Zz4=";
            e.dataTransfer.setDragImage(img, 0, 0);
          }}
          onDragEnd={() => {
            setDraggingId(null);
            setActiveColumn(null);
          }}
          className={`bg-white p-4 rounded-xl border shadow-sm 
          hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-grab
          ${getPriorityBorder(task.priority)}
          ${draggingId === task.id ? "opacity-40 scale-95" : ""}`}
        >
          {/* Title */}
          <h3 className="font-semibold text-gray-800">
            {task.title}
          </h3>

          {/* Due Date */}
          <p className={`text-xs mt-1 ${due.color}`}>
            {due.text}
          </p>

          {/* Bottom */}
          <div className="flex justify-between items-center mt-3">

            {/* Priority */}
            <span
              className={`px-2 py-1 text-xs rounded-full font-semibold ${getPriorityBadge(
                task.priority
              )}`}
            >
              {task.priority?.toUpperCase() || "LOW"}
            </span>

            {/* Assignee */}
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs font-bold">
              {task.assignee || "U"}
            </div>
          </div>
        </div>
      );
    });

  // ✅ COLUMN
  const Column = ({
    title,
    status,
  }: {
    title: string;
    status: string;
  }) => {
    const columnTasks = getTasks(status);

    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setActiveColumn(status);
        }}
        onDrop={() => {
          if (draggingId) moveTask(draggingId, status);
          setDraggingId(null);
          setActiveColumn(null);
        }}
        className={`p-4 rounded-xl flex flex-col h-[80vh]
        transition-all duration-200
        ${
          activeColumn === status
            ? "bg-blue-50 border-2 border-blue-400 scale-[1.02]"
            : "bg-gray-100 border"
        }`}
      >
        {/* Header */}
        <h2 className="font-bold mb-3 text-gray-700 flex justify-between">
          {title}
          <span className="bg-gray-300 px-2 rounded">
            {columnTasks.length}
          </span>
        </h2>

        {/* Tasks */}
        <div className="space-y-3 overflow-y-auto pr-1">
          {columnTasks.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No tasks 🚫
            </div>
          ) : (
            renderTasks(columnTasks)
          )}
        </div>
      </div>
    );
  };

  return (
    <div>

      {/* LEGEND */}
      <div className="flex gap-6 px-5 pt-3 text-sm items-center flex-wrap">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-700 rounded"></div>
          <span>Critical</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>High</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Medium</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Low</span>
        </div>

      </div>

      {/* COLUMNS */}
      <div className="grid grid-cols-4 gap-5 p-5">
        <Column title="To Do" status="todo" />
        <Column title="In Progress" status="inprogress" />
        <Column title="In Review" status="review" />
        <Column title="Done" status="done" />
      </div>
    </div>
  );
}