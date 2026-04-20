"use client";

import api from "@/lib/api";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  User,
  Users,
  XCircle,
  Clock,
  Home,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface EmployeeAttendance {
  id: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  designation: string;
  departmentName?: string;
  attendanceStatus: string;
  attendanceId: string | null;
}

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [employees, setEmployees] = useState<EmployeeAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/attendance?date=${date}`);
      setEmployees(res.data.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      toast.error("Failed to load attendance records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (employeeId: string, status: string) => {
    try {
      await api.post("/attendance/mark", { employeeId, date, status });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, attendanceStatus: status } : emp,
        ),
      );
      toast.success("Attendance updated");
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      toast.error("Failed to update attendance");
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem("harbor_token");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    // baseUrl usually has /api at the end, so we only add /attendance/export
    window.open(
      `${baseUrl}/attendance/export?date=${date}&token=${token}`,
      "_blank",
    );
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.firstName} ${emp.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: employees.length,
    present: employees.filter((e) => e.attendanceStatus === "Present").length,
    absent: employees.filter((e) => e.attendanceStatus === "Absent").length,
    halfDay: employees.filter((e) => e.attendanceStatus === "Half Day").length,
    wfh: employees.filter((e) => e.attendanceStatus === "WFH").length,
    notMarked: employees.filter((e) => e.attendanceStatus === "Not Marked")
      .length,
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-20 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
            Attendance Tracker
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Monitor and manage daily workspace presence across departments.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
          <button
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() - 1);
              setDate(d.toISOString().split("T")[0]);
            }}
            className="p-3 hover:bg-slate-50 rounded-xl text-slate-500 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3 px-4 py-2 border-x border-slate-50">
            <CalendarIcon size={18} className="text-blue-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() + 1);
              setDate(d.toISOString().split("T")[0]);
            }}
            className="p-3 hover:bg-slate-50 rounded-xl text-slate-500 transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Present",
            value: stats.present,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "WFH",
            value: stats.wfh,
            icon: Home,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Half Day",
            value: stats.halfDay,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Absent",
            value: stats.absent,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Missing",
            value: stats.notMarked,
            icon: AlertCircle,
            color: "text-slate-500",
            bg: "bg-slate-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col gap-4 group hover:shadow-lg transition-all duration-300"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </p>
              <p
                className={`text-2xl font-bold font-bricolage-grotesque ${stat.color}`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-6">
          <div className="relative w-full max-w-md group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[22px] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[22px] text-sm font-bold transition-all border border-slate-100"
            >
              <Download size={18} />
              <span>Export CSV</span>
            </button>
            <button className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[22px] border border-slate-100 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 bg-slate-50/10">
                <th className="pl-10 pr-6 py-6">Employee</th>
                <th className="px-6 py-6">Department</th>
                <th className="px-6 py-6 border-l border-slate-50 text-center bg-slate-50/20">
                  Attendance Status
                </th>
                <th className="pl-6 pr-10 py-6 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-10 pr-6 py-7">
                      <div className="h-12 w-48 bg-slate-100 rounded-xl" />
                    </td>
                    <td className="px-6 py-7">
                      <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="px-6 py-7">
                      <div className="h-10 w-full bg-slate-100 rounded-xl" />
                    </td>
                    <td className="pl-6 pr-10 py-7 text-right">
                      <div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-10 py-32 text-center text-slate-500 font-medium"
                  >
                    No records found for this date.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="group hover:bg-slate-50/50 transition-all duration-300"
                  >
                    <td className="pl-10 pr-6 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:rotate-3 transition-transform">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                            {emp.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        {emp.departmentName || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-7 border-l border-slate-50 bg-slate-50/5 min-w-[340px]">
                      <div className="flex items-center gap-2">
                        {[
                          {
                            label: "Present",
                            color:
                              "text-emerald-600 bg-emerald-50 border-emerald-100 active:bg-emerald-600 active:text-white",
                          },
                          {
                            label: "WFH",
                            color:
                              "text-blue-600 bg-blue-50 border-blue-100 active:bg-blue-600 active:text-white",
                          },
                          {
                            label: "Half Day",
                            color:
                              "text-amber-600 bg-amber-50 border-amber-100 active:bg-amber-600 active:text-white",
                          },
                          {
                            label: "Absent",
                            color:
                              "text-red-600 bg-red-50 border-red-100 active:bg-red-600 active:text-white",
                          },
                        ].map((status) => (
                          <button
                            key={status.label}
                            onClick={() =>
                              handleStatusChange(emp.id, status.label)
                            }
                            className={`flex-1 py-3.5 px-3 rounded-[18px] text-sm font-bold uppercase tracking-wider border-2 transition-all active:scale-95 ${
                              emp.attendanceStatus === status.label
                                ? `${status.color.replace("active:", "")} border-current shadow-[0_4px_12px_rgba(0,0,0,0.05)]`
                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="pl-6 pr-10 py-7 text-right">
                      <Link
                        href={`/attendance/report?employeeId=${emp.id}`}
                        className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                      >
                        History
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
