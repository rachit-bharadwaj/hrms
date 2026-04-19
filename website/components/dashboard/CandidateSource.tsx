"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const COLORS = [
  "text-blue-600",
  "text-blue-400",
  "text-blue-300",
  "text-blue-200",
  "text-cyan-400",
];

const BG_COLORS = [
  "bg-blue-600",
  "bg-blue-400",
  "bg-blue-300",
  "bg-blue-200",
  "bg-cyan-400",
];

export default function CandidateSource() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSources(response.data.data.leaveDistribution);
      } catch (error) {
        console.error("Error fetching leave distribution:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = sources.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <h3 className="font-bricolage-grotesque text-slate-500 tracking-tight text-xl">
        Leave Type Distribution
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Doughnut Chart (CSS Based) */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="12"
            />
            {!loading && total > 0 && sources.map((source, index) => {
              const percentage = (source.count / total) * 100;
              const strokeDasharray = `${(percentage / 100) * 251.2} 251.2`;
              let offset = 0;
              for (let i = 0; i < index; i++) {
                offset += (sources[i].count / total) * 251.2;
              }

              return (
                <circle
                  key={source.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  className={COLORS[index % COLORS.length]}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={-offset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 tracking-tighter">
              {total}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Requests</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-3 w-full">
          {loading ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : sources.length === 0 ? (
            <div className="text-slate-400 text-sm">No data</div>
          ) : (
            sources.map((source, index) => (
              <div
                key={source.name}
                className="flex items-center justify-between group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-md ${BG_COLORS[index % BG_COLORS.length]} shadow-sm group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-sm">
                    {source.name}
                  </span>
                </div>
                <span className="text-sm">
                  {source.count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
