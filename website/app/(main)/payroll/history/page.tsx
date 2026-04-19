"use client";

import api from "@/lib/api";
import { 
  ArrowRight,
  Download, 
  FileText, 
  History, 
  Search,
  CheckCircle2,
  CalendarDays,
  Gem
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PayrollHistoryPage() {
  const [payslips, setPayslips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/payroll/my-payslips");
      setPayslips(res.data.data);
    } catch (error) {
      console.error("Failed to fetch payroll history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex flex-col gap-10 w-full p-4 md:p-8 pb-20">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">
          Salary History
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Access and download your monthly salary slips and tax documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-900 text-white rounded-xl">
                        <History size={16} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 font-bricolage-grotesque">Payslip Records</h3>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search year..." 
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                    />
                  </div>
               </div>

               <div className="divide-y divide-slate-50">
                  {isLoading ? (
                     Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-8 animate-pulse flex items-center justify-between">
                           <div className="h-6 w-48 bg-slate-100 rounded-lg" />
                           <div className="h-10 w-32 bg-slate-100 rounded-xl" />
                        </div>
                     ))
                  ) : payslips.length === 0 ? (
                     <div className="p-20 text-center text-slate-400 font-medium">No payroll history available yet.</div>
                  ) : (
                     payslips.map((ps: any) => (
                        <div key={ps.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all duration-300">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 group-hover:rotate-3 transition-transform">
                                 <FileText size={24} />
                              </div>
                              <div>
                                 <h4 className="text-lg font-bold text-slate-900 font-bricolage-grotesque">{monthNames[ps.month-1]} {ps.year}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{ps.payslipNumber}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-10">
                              <div className="text-right hidden sm:block">
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Net Payable</p>
                                 <p className="text-xl font-bold text-emerald-600 font-bricolage-grotesque">₹{ps.netPay.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Link 
                                   href={`/payroll/payslip/${ps.id}`}
                                   className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-90"
                                 >
                                    <ArrowRight size={18} />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar Extras */}
         <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6">
                     <Gem size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold font-bricolage-grotesque">Tax Documents</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">Download your Form 16 and annual tax declarations for the financial year 2025-26.</p>
                  <button className="w-full mt-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/5">
                     Access Tax Portal
                  </button>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                   <CheckCircle2 size={18} />
                   <span className="text-xs font-bold uppercase tracking-widest">Verified History</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Your salary is processed every last working day of the month. In case of discrepancies, please contact HR.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
