"use client";

import { useState, useEffect } from "react";
import { Settings2, Plus, Edit2, Trash2, ShieldCheck, Coins, RefreshCcw } from "lucide-react";
import api from "@/lib/api";
import LeaveTypeModal from "./LeaveTypeModal";

export default function LeaveTypesManager() {
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/leaves/types");
      setLeaveTypes(res.data.data);
    } catch (error) {
      console.error("Failed to fetch leave types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will only work if no employee has used this leave type yet.")) {
      try {
        await api.delete(`/leaves/types/${id}`);
        fetchLeaveTypes();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white/50 backdrop-blur-sm p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 text-white rounded-[22px] shadow-lg shadow-slate-900/10">
            <Settings2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">Leave Type Configuration</h3>
            <p className="text-sm text-slate-500 font-medium">Global rules for annual quotas and carry-forward.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingType(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-slate-900/10"
        >
          <Plus size={18} />
          <span>New Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-[32px] animate-pulse" />
          ))
        ) : leaveTypes.map((type) => (
          <div key={type.id} className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-900 text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  {type.code}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{type.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                       <ShieldCheck size={10} /> {type.requiresApprovalBy}
                     </span>
                     {type.encashable && (
                       <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">
                         <Coins size={10} /> Encashable
                       </span>
                     )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => { setEditingType(type); setIsModalOpen(true); }}
                   className="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                 >
                   <Edit2 size={16} />
                 </button>
                 <button 
                   onClick={() => handleDelete(type.id)}
                   className="p-2 hover:bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Quota</p>
                  <p className="text-xl font-black text-slate-900">{type.annualQuota} Days</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Carry Forward</p>
                  <p className="text-xl font-black text-slate-900 text-right">Max {type.maxCarryForward}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <LeaveTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={fetchLeaveTypes}
        initialData={editingType}
      />
    </div>
  );
}
