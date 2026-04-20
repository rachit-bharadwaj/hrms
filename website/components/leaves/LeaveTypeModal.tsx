"use client";

import { useEffect, useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface LeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: any;
}

export default function LeaveTypeModal({ isOpen, onClose, onSubmit, initialData }: LeaveTypeModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    annualQuota: 0,
    maxCarryForward: 0,
    encashable: false,
    requiresApprovalBy: "MANAGER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        name: initialData.name || "",
        annualQuota: initialData.annualQuota || 0,
        maxCarryForward: initialData.maxCarryForward || 0,
        encashable: initialData.encashable || false,
        requiresApprovalBy: initialData.requiresApprovalBy || "MANAGER",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (initialData) {
        await api.put(`/leaves/types/${initialData.id}`, formData);
      } else {
        await api.post("/leaves/types", formData);
      }
      onSubmit();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save leave type");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-top-4 duration-300">
        <div className="p-8 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">
                {initialData ? "Edit Leave Type" : "New Leave Type"}
              </h2>
              <p className="text-slate-500 text-sm font-medium">Configure leave eligibility and rules.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in shake duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SL, CL, PL"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Display Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sick Leave"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Annual Quota (Days)</label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                value={formData.annualQuota}
                onChange={(e) => setFormData({ ...formData, annualQuota: parseFloat(e.target.value) })}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Max Carry Forward</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.maxCarryForward}
                onChange={(e) => setFormData({ ...formData, maxCarryForward: parseFloat(e.target.value) })}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <div>
               <p className="font-bold text-slate-900">Is Encashable?</p>
               <p className="text-xs text-slate-500 font-medium">Allow employees to encash unused leaves.</p>
             </div>
             <input
               type="checkbox"
               checked={formData.encashable}
               onChange={(e) => setFormData({ ...formData, encashable: e.target.checked })}
               className="w-6 h-6 rounded-lg accent-primary border-transparent"
             />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Requires Approval By</label>
            <select
              value={formData.requiresApprovalBy}
              onChange={(e) => setFormData({ ...formData, requiresApprovalBy: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-slate-900"
            >
              <option value="MANAGER">Direct Manager</option>
              <option value="HR">HR Department</option>
              <option value="BOTH">Both Manager & HR</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[22px] font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span>{initialData ? "Update Configuration" : "Save Leave Type"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
