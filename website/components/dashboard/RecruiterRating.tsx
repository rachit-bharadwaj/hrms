"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Clock } from "lucide-react";

export default function RecruiterRating() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setLeaves(response.data.data.latestPendingLeaves);
      } catch (error) {
        console.error("Error fetching pending leaves:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <p className="text-slate-500 tracking-tight text-xl font-bricolage-grotesque">
        Pending Leave Requests
      </p>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-slate-500 py-10 text-center">
            Loading requests...
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-slate-500 py-10 text-center">
            No pending requests
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50 text-slate-500">
                <th className="pb-4">Employee</th>
                <th className="pb-4">Leave Type</th>
                <th className="pb-4">Date Range</th>
                <th className="pb-4">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center">
                        {leave.employeePhoto ? (
                          <img
                            src={leave.employeePhoto}
                            alt={leave.employeeName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-500">
                            {leave.employeeName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-900">
                        {leave.employeeName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-slate-700">{leave.leaveType}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Clock size={14} className="text-slate-500" />
                      <span>
                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-4 text-slate-700">
                      <span className="font-medium">{leave.days} days</span>
                      <div className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-sm font-bold uppercase">
                        {leave.status}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
