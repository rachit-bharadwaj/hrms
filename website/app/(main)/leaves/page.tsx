"use client";

import api from "@/lib/api";
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  History, 
  LayoutGrid, 
  Plus, 
  User,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import LeaveBalanceCard from "@/components/leaves/LeaveBalanceCard";
import LeaveApplicationModal from "@/components/leaves/LeaveApplicationModal";

export default function LeavesPage() {
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [bRes, rRes] = await Promise.all([
        api.get("/leaves/balances"),
        api.get("/leaves/my-requests")
      ]);
      setBalances(bRes.data.data);
      setRequests(rRes.data.data);
    } catch (error) {
      console.error("Failed to fetch leave data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-50 text-emerald-600 ring-emerald-100";
      case "REJECTED": return "bg-red-50 text-red-600 ring-red-100";
      default: return "bg-amber-50 text-amber-600 ring-amber-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle2 size={12} />;
      case "REJECTED": return <XCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full p-4 md:p-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
            Leave Management
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Track your leave cycles, balances, and historical applications.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[22px] text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Balances Section */}
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
               <LayoutGrid size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-bricolage-grotesque">Available Balances</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 w-full bg-slate-100 rounded-[32px] animate-pulse" />
               ))
            ) : balances.length === 0 ? (
               <div className="col-span-3 p-10 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No active leave balances found for current year.
               </div>
            ) : (
               balances.map((b, i) => <LeaveBalanceCard key={i} balance={b} />)
            )}
         </div>
      </div>

      {/* History Section */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <History size={18} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 font-bricolage-grotesque">Leave History</h3>
            </div>
            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-all">
               View Full Archive
            </button>
         </div>

         <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
            <table className="w-full">
               <thead>
                  <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/10">
                     <th className="pl-10 pr-6 py-6">Leave Type</th>
                     <th className="px-6 py-6">Timeline</th>
                     <th className="px-6 py-6 text-center">Duration</th>
                     <th className="px-6 py-6 border-l border-slate-50 text-center bg-slate-50/20">Decision Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                     Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                           <td className="pl-10 pr-6 py-7"><div className="h-8 w-32 bg-slate-100 rounded-lg" /></td>
                           <td className="px-6 py-7"><div className="h-8 w-48 bg-slate-100 rounded-lg" /></td>
                           <td className="px-6 py-7"><div className="h-8 w-16 bg-slate-100 rounded-lg mx-auto" /></td>
                           <td className="px-6 py-7"><div className="h-8 w-24 bg-slate-100 rounded-lg mx-auto" /></td>
                        </tr>
                     ))
                  ) : requests.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-10 py-24 text-center text-slate-400 font-medium">You haven't applied for any leaves yet.</td>
                     </tr>
                  ) : (
                     requests.map((req: any) => (
                        <tr key={req.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                           <td className="pl-10 pr-6 py-7">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:rotate-3 transition-transform">
                                    <Calendar size={18} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">{req.leaveTypeName}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Requested {new Date(req.appliedAt).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-7">
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-bold text-slate-600">{new Date(req.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                 <div className="h-0.5 w-4 bg-slate-200 rounded-full" />
                                 <span className="text-xs font-bold text-slate-600">{new Date(req.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                           </td>
                           <td className="px-6 py-7 text-center">
                              <span className="text-sm font-black text-slate-900">{req.days} <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Days</span></span>
                           </td>
                           <td className="px-6 py-7 border-l border-slate-50 bg-slate-50/5">
                              <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest ring-1 ${getStatusStyle(req.status)}`}>
                                 {getStatusIcon(req.status)}
                                 {req.status}
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <LeaveApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={fetchData} 
      />
    </div>
  );
}
