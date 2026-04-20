"use client";

import api from "@/lib/api";
import { X, Calendar as CalendarIcon, FileText, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface LeaveType {
  id: string;
  name: string;
  code: string;
}

export default function LeaveApplicationModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    days: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaveTypes();
      fetchHolidays();
    }
  }, [isOpen]);

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/holidays");
      setHolidays(res.data.data);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const res = await api.get("/leaves/types");
      setLeaveTypes(res.data.data);
    } catch (error) {
      console.error("Failed to fetch leave types:", error);
    }
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const holidayDates = holidays.map(
        (h) => new Date(h.date).toISOString().split("T")[0],
      );

      let count = 0;
      let curr = new Date(start);
      while (curr <= end) {
        const dayOfWeek = curr.getDay();
        const dateStr = curr.toISOString().split("T")[0];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isHoliday = holidayDates.includes(dateStr);

        if (!isWeekend && !isHoliday) {
          count++;
        }
        curr.setDate(curr.getDate() + 1);
      }

      setFormData((prev) => ({ ...prev, days: count }));
    }
  }, [formData.startDate, formData.endDate, holidays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.post("/leaves/apply", formData);
      toast.success("Leave application submitted successfully");
      onSubmit();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
              Apply for Leave
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Please provide details for your leave request.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-500 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Leave Type
            </label>
            <select
              required
              value={formData.leaveTypeId}
              onChange={(e) =>
                setFormData({ ...formData, leaveTypeId: e.target.value })
              }
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Start Date
              </label>
              <div className="relative">
                <CalendarIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                End Date
              </label>
              <div className="relative">
                <CalendarIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {formData.days > 0 && (
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Calculated Duration
              </span>
              <span className="text-lg font-bold text-blue-700">
                {formData.days} Days
              </span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Reason for Leave
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-4 text-slate-500"
                size={18}
              />
              <textarea
                required
                rows={3}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Mention valid reason..."
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4.5 bg-primary text-white rounded-[22px] text-sm font-bold hover:bg-primary/80 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              "Submitting..."
            ) : (
              <>
                <Send size={18} />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
