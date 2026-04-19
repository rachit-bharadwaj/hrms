"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AverageClosingTime() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setTasks(response.data.data.upcomingTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <p className="text-slate-500 tracking-tight text-xl font-bricolage-grotesque">
        Upcoming Tasks
      </p>

      {loading ? (
        <div className="text-slate-400 py-10 text-center">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-slate-400 py-10 text-center">No upcoming tasks</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {task.employeePhoto ? (
                    <img
                      src={task.employeePhoto}
                      alt={task.employeeName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      {task.employeeName?.charAt(0) || "T"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 text-sm font-medium leading-tight">{task.title}</span>
                  <span className="text-slate-400 text-xs">{task.employeeName}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center min-w-[60px] bg-blue-50 group-hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors">
                <span className="text-blue-600 tracking-tighter font-bold">
                  {getDaysLeft(task.dueDate)}
                </span>
                <span className="text-[10px] font-bold text-blue-400 uppercase">
                  days left
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
