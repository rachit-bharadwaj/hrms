"use client";

import api from "@/lib/api";
import { 
  Banknote, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Play, 
  Settings, 
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PayrollDashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentPayslips, setRecentPayslips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleRunPayroll = async () => {
    if (!confirm(`Are you sure you want to generate payroll for ${months[month-1]} ${year}?`)) return;

    try {
      setIsProcessing(true);
      const res = await api.post("/payroll/process", { month, year });
      toast.success(`Successfully processed payroll for ${res.data.data.length} employees`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process payroll");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
            Payroll Processing
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage salary structures and automate monthly disbursements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Run Payroll Card */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-900/10">
                 <Play size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">Batch Run</h3>
                 <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Generate Monthly Payslips</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payroll Month</label>
                 <select 
                    value={month} 
                    onChange={e => setMonth(parseInt(e.target.value))}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                 >
                    {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payroll Year</label>
                 <select 
                   value={year} 
                   onChange={e => setYear(parseInt(e.target.value))}
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                 >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                 </select>
              </div>
           </div>

           <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
              <div className="flex items-start gap-4">
                 <div className="mt-1 text-blue-500"><AlertCircle size={20} /></div>
                 <div>
                    <p className="text-sm font-bold text-slate-700">Important Note</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Generated payslips will be immediately available to employees in their personal dashboard. Ensure all salary structures are updated before running.</p>
                 </div>
              </div>
              <button 
                onClick={handleRunPayroll}
                disabled={isProcessing}
                className="w-full py-4.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? "Processing Batch..." : `Process ${months[month-1]} ${year} Payroll`}
              </button>
           </div>
        </div>

        {/* Quick Stats Card */}
        <div className="space-y-6">
           {[
             { label: "Active Structures", value: "84%", icon: Settings, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Avg. Net Pay", value: "₹42,500", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Total Deductions", value: "₹1.2L", icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50" }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all duration-300">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                   <stat.icon size={22} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className={`text-2xl font-bold font-bricolage-grotesque ${stat.color}`}>{stat.value}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* History Table Placeholder */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden mt-4">
         <div className="p-8 border-b border-slate-50">
            <h3 className="text-xl font-bold text-slate-900 font-bricolage-grotesque">Recent Disbursements</h3>
         </div>
         <div className="p-20 text-center text-slate-400 font-medium italic">
            Select a specific Month/Year to view generated payslip records.
         </div>
      </div>
    </div>
  );
}
