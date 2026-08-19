"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface TrendItem {
  date: string;
  dayName: string;
  dayNum: number;
  present: number;
  absent: number;
}

export default function CandidateStats() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<TrendItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setData(response.data.data.attendanceTrend || []);
      } catch (error) {
        console.error("Error fetching attendance trend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate continuous last 14 days timeline
  const generateTimeline = (): TrendItem[] => {
    const trendMap = new Map<string, any>(data.map((d) => [d.date, d]));
    const daysCount = 14;
    const timeline: TrendItem[] = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const existing = trendMap.get(dateStr);

      timeline.push({
        date: dateStr,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: d.getDate(),
        present: existing ? Number(existing.present) : 0,
        absent: existing ? Number(existing.absent) : 0,
      });
    }

    return timeline;
  };

  const chartData = generateTimeline();
  const maxVal = Math.max(
    ...chartData.map((d) => d.present + d.absent),
    10
  );
  const totalPresent = chartData.reduce((sum, d) => sum + d.present, 0);
  const totalAbsent = chartData.reduce((sum, d) => sum + d.absent, 0);
  const hasData = totalPresent > 0 || totalAbsent > 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6 relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="font-bricolage-grotesque text-slate-800 tracking-tight text-xl font-semibold">
            Attendance Overview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily present vs. absent employees over the last 14 days
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
            <span className="text-slate-600 font-medium text-xs">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300 shadow-sm" />
            <span className="text-slate-600 font-medium text-xs">Absent</span>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="relative h-60 w-full flex flex-col justify-between pt-4">
        {/* Background Horizontal Gridlines */}
        <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
          <div className="border-b border-dashed border-slate-100 w-full" />
          <div className="border-b border-dashed border-slate-100 w-full" />
          <div className="border-b border-dashed border-slate-100 w-full" />
          <div className="border-b border-slate-200 w-full" />
        </div>

        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm animate-pulse">
            Loading attendance data...
          </div>
        ) : (
          <div className="w-full h-full flex items-end justify-between gap-2 z-10 pb-8 px-2">
            {chartData.map((item) => {
              const presentHeight = (item.present / maxVal) * 100;
              const absentHeight = (item.absent / maxVal) * 100;
              const isZero = item.present === 0 && item.absent === 0;

              return (
                <div
                  key={item.date}
                  onMouseEnter={() => setHoveredDay(item)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Hover Tooltip */}
                  {hoveredDay?.date === item.date && (
                    <div className="absolute -top-12 z-30 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <div className="font-semibold text-slate-200 mb-0.5">
                        {item.dayName}, {item.date}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-blue-300">Present: {item.present}</span>
                        <span className="text-slate-300">Absent: {item.absent}</span>
                      </div>
                    </div>
                  )}

                  {/* Bar Column Container */}
                  <div className="relative w-full max-w-[28px] h-full flex items-end justify-center">
                    {isZero ? (
                      /* Zero-state baseline pill */
                      <div className="w-full h-1.5 bg-slate-100 rounded-full group-hover:bg-blue-300 group-hover:h-3 transition-all duration-200" />
                    ) : (
                      /* Stacked Bars */
                      <div className="w-full flex flex-col justify-end h-full relative">
                        {/* Absent Bar */}
                        {item.absent > 0 && (
                          <div
                            className="w-full bg-slate-300 hover:bg-slate-400 transition-all rounded-t-sm"
                            style={{ height: `${absentHeight}%` }}
                          />
                        )}
                        {/* Present Bar */}
                        {item.present > 0 && (
                          <div
                            className="w-full bg-blue-600 hover:bg-blue-700 transition-all rounded-t-sm"
                            style={{ height: `${presentHeight}%` }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* X-Axis Date Labels */}
                  <div className="absolute -bottom-7 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                      {item.dayNum}
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tighter">
                      {item.dayName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Footer Status */}
      {!loading && !hasData && (
        <div className="bg-slate-50 rounded-lg py-2.5 px-4 flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>No attendance recorded yet for this 14-day window.</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Ready to log
          </span>
        </div>
      )}
    </div>
  );
}

