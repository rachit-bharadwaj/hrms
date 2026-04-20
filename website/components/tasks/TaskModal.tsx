"use client";

import api from "@/lib/api";
import {
  X,
  Calendar as CalendarIcon,
  Tag,
  User,
  Send,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedToEmployeeId: "",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchEmployees();
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.post("/tasks", formData);
      toast.success("Task assigned successfully");
      onSubmit();
      onClose();
      setFormData({
        title: "",
        description: "",
        assignedToEmployeeId: "",
        priority: "MEDIUM",
        dueDate: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to assign task");
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
              Assign Task
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Delegate responsibility to an employee.
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
              Task Title
            </label>
            <div className="relative">
              <Tag
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                required
                placeholder="e.g. Q4 Budget Review"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Assign To
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <select
                required
                value={formData.assignedToEmployeeId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedToEmployeeId: e.target.value,
                  })
                }
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Due Date
              </label>
              <div className="relative">
                <CalendarIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Priority
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Description
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-4 text-slate-500"
                size={18}
              />
              <textarea
                rows={3}
                placeholder="Details about the task..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
              "Assigning..."
            ) : (
              <>
                <Send size={18} />
                <span>Assign Task</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
