"use client";

import api from "@/lib/api";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [decisionRemarks, setDecisionRemarks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/leaves/pending");
      setRequests(res.data.data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, status: string) => {
    try {
      await api.put(`/leaves/status/${id}`, {
        status,
        decisionRemarks: decisionRemarks[id] || ""
      });
      toast.success(`Leave request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
          Pending Approvals
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Review and process leave applications from your team.
        </p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Filter by employee name..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[22px] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter size={18} />
                <span>Status: Pending</span>
             </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-10 animate-pulse flex flex-col gap-4">
                <div className="h-6 w-48 bg-slate-100 rounded-lg" />
                <div className="h-4 w-full bg-slate-100 rounded-lg" />
              </div>
            ))
          ) : requests.length === 0 ? (
            <div className="p-24 text-center">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">All Caught Up!</h3>
               <p className="text-slate-500 text-sm font-medium mt-1">No pending leave requests to review at the moment.</p>
            </div>
          ) : (
            requests.map((req: any) => (
              <div key={req.id} className="p-10 hover:bg-slate-50/30 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                  <div className="flex-1 flex gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 shrink-0">
                        <User size={24} />
                     </div>
                     <div className="space-y-4">
                        <div>
                           <h4 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">{req.employeeName}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{req.leaveTypeName}</span>
                              <div className="w-1 h-1 bg-slate-300 rounded-full" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied on {new Date(req.appliedAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                           <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                              <Calendar size={14} className="text-slate-400" />
                              <span className="text-xs font-bold text-slate-700">
                                {new Date(req.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — {new Date(req.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                           </div>
                           <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                              <Clock size={14} className="text-blue-500" />
                              <span className="text-xs font-bold text-blue-700">{req.days} Days</span>
                           </div>
                        </div>

                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                           <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{req.reason}"</p>
                        </div>
                     </div>
                  </div>

                  <div className="w-full lg:w-80 space-y-4">
                     <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-slate-400" size={16} />
                        <textarea
                          placeholder="Add decision remarks..."
                          value={decisionRemarks[req.id] || ""}
                          onChange={(e) => setDecisionRemarks(prev => ({ ...prev, [req.id]: e.target.value }))}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none resize-none transition-all"
                          rows={2}
                        />
                     </div>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => handleAction(req.id, "APPROVED")}
                          className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, "REJECTED")}
                          className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/10 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
