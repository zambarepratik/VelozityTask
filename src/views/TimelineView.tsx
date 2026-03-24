import { useTaskStore } from "../store/useTaskStore";

export default function TimelineView() {
  const { tasks } = useTaskStore();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 🔥 POSITION CALCULATION
  const getPosition = (dateStr: string) => {
    const d = new Date(dateStr);
    return ((d.getDate() - 1) / daysInMonth) * 100;
  };

  // 🔥 WIDTH CALCULATION
  const getWidth = (start?: string, end?: string) => {
    if (!start) return (1 / daysInMonth) * 100;

    const s = new Date(start).getDate();
    const e = new Date(end || start).getDate();

    return ((e - s + 1) / daysInMonth) * 100;
  };

  // 🔥 PRIORITY COLORS (FIXED MAIN ISSUE)
  const priorityColor = (p: string) => {
    if (p === "critical") return "bg-red-500";
    if (p === "high") return "bg-orange-400";
    if (p === "medium") return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="p-5 h-[85vh] flex flex-col">

      {/* HEADER */}
      <h2 className="text-xl font-bold mb-4">📅 Timeline View</h2>

      <div className="bg-white rounded-2xl shadow border flex-1 overflow-auto">

        {/* MONTH */}
        <div className="p-4 border-b font-semibold text-gray-700">
          {today.toLocaleString("default", { month: "long" })} {year}
        </div>

        {/* DAYS HEADER */}
        <div className="grid grid-cols-31 text-xs text-gray-500 border-b">
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div key={i} className="text-center py-2 border-r">
              {i + 1}
            </div>
          ))}
        </div>

        {/* BODY */}
        <div className="relative p-4 space-y-5">

          {/* 🔥 TODAY LINE */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-blue-600 z-20"
            style={{
              left: `${(today.getDate() / daysInMonth) * 100}%`,
            }}
          />

          {tasks.map((task: any) => {
            const start = task.startDate;
            const end = task.dueDate;

            const left = start
              ? getPosition(start)
              : getPosition(end);

            const width = start
              ? getWidth(start, end)
              : (1 / daysInMonth) * 100;

            return (
              <div key={task.id} className="flex items-center gap-4">

                {/* TASK NAME */}
                <div className="w-52 text-sm font-semibold text-gray-700 truncate">
                  {task.title}
                </div>

                {/* TRACK */}
                <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden">

                  {/* GRID LINES */}
                  <div className="absolute inset-0 grid grid-cols-31">
                    {Array.from({ length: 31 }).map((_, i) => (
                      <div key={i} className="border-r border-gray-200"></div>
                    ))}
                  </div>

                  {/* 🔥 TASK BAR */}
                  <div
                    className={`absolute h-8 rounded-lg flex items-center px-3 text-white text-xs font-medium shadow-lg
                    ${priorityColor(task.priority)}
                    hover:scale-105 transition-all`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  >
                    {/* TITLE */}
                    <span className="truncate">
                      {task.title}
                    </span>

                    {/* ASSIGNEE */}
                    <div className="ml-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-bold">
                      {task.assignee}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* 🔥 LEGEND */}
      <div className="flex gap-6 mt-3 text-sm flex-wrap">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Critical</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span>High</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Medium</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Low</span>
        </div>

      </div>

    </div>
  );
}