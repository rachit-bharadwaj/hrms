"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CandidateStats() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setData(response.data.data.attendanceTrend);
      } catch (error) {
        console.error("Error fetching attendance trend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use last 30 days or available data
  const chartData = data.slice(-30);
  const maxVal = Math.max(...chartData.map(d => Math.max(d.present, d.absent)), 10);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bricolage-grotesque text-slate-500 tracking-tight text-xl">
          Attendance Overview
        </h3>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-slate-500">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-100" />
            <span className="text-slate-500">Absent</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end gap-1.5 overflow-hidden">
        {loading ? (
           <div className="w-full h-full flex items-center justify-center text-slate-400">Loading trend...</div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No attendance data found</div>
        ) : (
          chartData.map((item, i) => {
            const presentHeight = (item.present / maxVal) * 100;
            const absentHeight = (item.absent / maxVal) * 100;
            const dayNum = new Date(item.date).getDate();

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center gap-2 group"
                title={`${item.date}: ${item.present} Present, ${item.absent} Absent`}
              >
                <div className="relative w-full h-48 flex items-end justify-center">
                  {/* Absent Bar */}
                  <div
                    className="w-full bg-blue-50 hover:bg-blue-100 transition-colors rounded-t-sm"
                    style={{ height: `${absentHeight}%` }}
                  />
                  {/* Present Bar (Stacked) */}
                  {item.present > 0 && (
                    <div
                      className="absolute w-full bg-blue-500 rounded-t-sm z-10"
                      style={{ height: `${presentHeight}%` }}
                    />
                  )}
                </div>
                <div className="text-[10px] font-bold text-slate-400">{dayNum}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
