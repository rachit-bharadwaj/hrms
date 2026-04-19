"use client";

import api from "@/lib/api";
import { X, Calendar as CalendarIcon, Tag, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function HolidayModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: "",
    type: "National",
    location: "All"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.post("/holidays", formData);
      toast.success("Holiday added successfully");
      onSubmit();
      onClose();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        name: "",
        type: "National",
        location: "All"
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add holiday");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">Schedule Holiday</h2>
            <p className="text-slate-500 text-sm font-medium">Add a new official holiday to the company calendar.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Event Name</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g. Independence Day"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="National">National</option>
                  <option value="Regional">Regional</option>
                  <option value="Optional">Optional</option>
                  <option value="Company Holiday">Company Holiday</option>
                </select>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Applicable Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="e.g. All Offices, Delhi, Bangalore"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4.5 bg-slate-900 text-white rounded-[22px] text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : (
              <>
                <Send size={18} />
                <span>Publish Holiday</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
