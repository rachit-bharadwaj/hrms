"use client";

import api from "@/lib/api";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  PieChart,
  User,
  Users,
  Search,
  Building2,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  remarks: string;
}

function AttendanceReportContent() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);

  useEffect(() => {
    if (employeeId) {
      fetchReport();
      fetchEmployeeInfo();
    }
  }, [employeeId, month, year]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `/attendance/employee/${employeeId}?month=${month}&year=${year}`,
      );
      setRecords(res.data.data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      toast.error("Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeInfo = async () => {
    try {
      const res = await api.get(`/employees/${employeeId}`);
      setEmployeeInfo(res.data.data);
    } catch (error) {
      console.error("Failed to fetch employee info:", error);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const stats = {
    present: records.filter((r) => r.status === "Present").length,
    wfh: records.filter((r) => r.status === "WFH").length,
    halfDay: records.filter((r) => r.status === "Half Day").length,
    absent: records.filter((r) => r.status === "Absent").length,
  };

  if (!employeeId) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-slate-100 shadow-sm text-center gap-6">
        <div className="p-8 bg-blue-50 rounded-full text-blue-500">
          <Search size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
            No Employee Selected
          </h2>
          <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">
            Please select an employee from the attendance list or directory to
            view their monthly report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
              {employeeInfo
                ? `${employeeInfo.firstName} ${employeeInfo.lastName}`
                : "Employee"}{" "}
              Report
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                {employeeInfo?.employeeCode}
              </span>
              <span className="text-slate-500 text-xs font-medium">
                {monthNames[month - 1]} {year}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
          <button
            onClick={() => {
              if (month === 1) {
                setMonth(12);
                setYear(year - 1);
              } else setMonth(month - 1);
            }}
            className="p-3 hover:bg-slate-50 rounded-xl text-slate-500 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-6 py-2 text-sm font-bold text-slate-700 min-w-[140px] text-center">
            {monthNames[month - 1]} {year}
          </div>
          <button
            onClick={() => {
              if (month === 12) {
                setMonth(1);
                setYear(year + 1);
              } else setMonth(month + 1);
            }}
            className="p-3 hover:bg-slate-50 rounded-xl text-slate-500 transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Days Present",
            value: stats.present,
            color: "text-emerald-600",
            icon: CheckCircle2,
            bg: "bg-emerald-50",
          },
          {
            label: "WFH Sessions",
            value: stats.wfh,
            color: "text-blue-600",
            icon: Home,
            bg: "bg-blue-50",
          },
          {
            label: "Half Days",
            value: stats.halfDay,
            color: "text-amber-600",
            icon: Clock,
            bg: "bg-amber-50",
          },
          {
            label: "Days Absent",
            value: stats.absent,
            color: "text-red-600",
            icon: XCircle,
            bg: "bg-red-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-sm font-black text-slate-300 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <p
              className={`text-4xl font-bold font-bricolage-grotesque ${stat.color}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">
            Daily Attendance Log
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="p-3 hover:bg-slate-50 text-slate-500 border border-slate-100 rounded-xl transition-all"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50">
                <th className="pl-10 pr-6 py-5">Date</th>
                <th className="px-6 py-5">Weekday</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="pl-6 pr-10 py-5">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-10 pr-6 py-6">
                      <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-6 flex justify-center">
                      <div className="h-8 w-24 bg-slate-100 rounded-full" />
                    </td>
                    <td className="pl-6 pr-10 py-6">
                      <div className="h-6 w-full bg-slate-100 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-10 py-20 text-center text-slate-500 font-medium"
                  >
                    No records found for this period.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const dateObj = new Date(record.date);
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="pl-10 pr-6 py-6 text-sm font-bold text-slate-700">
                        {dateObj.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {dateObj.toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest ${
                            record.status === "Present"
                              ? "bg-emerald-50 text-emerald-600"
                              : record.status === "WFH"
                                ? "bg-blue-50 text-blue-600"
                                : record.status === "Half Day"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-red-50 text-red-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="pl-6 pr-10 py-6 text-sm text-slate-500 font-medium italic">
                        {record.remarks || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Add these missing icons for the stats
import { CheckCircle2, Home, Clock, XCircle } from "lucide-react";

export default function AttendanceReportPage() {
  return (
    <Suspense fallback={<div>Loading Report...</div>}>
      <AttendanceReportContent />
    </Suspense>
  );
}
