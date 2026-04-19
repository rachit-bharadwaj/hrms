"use client";

import api from "@/lib/api";
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Building2, 
  User,
  Calendar,
  Wallet,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Mail,
  Smartphone
} from "lucide-react";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function PayslipDetailPage({ params }: { params: any }) {
  const { id } = use(params) as { id: string };
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/payroll/payslip/${id}`);
      setData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch payslip:", error);
      toast.error("Payslip not found");
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Generating Digital Payslip...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Payslip not found.</div>;

  const { payslip, employee, department, month, year } = data;

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8 pb-20 max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print mb-4">
         <Link href="/payroll/history" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-bold">
            <ArrowLeft size={16} />
            <span>Back to History</span>
         </Link>
         <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
            >
               <Printer size={16} />
               <span>Print / Download PDF</span>
            </button>
         </div>
      </div>

      {/* Payslip Document */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden print:shadow-none print:border-none print:m-0 print:p-8">
        {/* Header Section */}
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-50/30">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center text-white">
                <Building2 size={32} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque leading-tight">Harbor HRMS Platform</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Salary Slip for {monthNames[month-1]} {year}</p>
             </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Official Record</span>
             <h3 className="text-lg font-bold text-slate-900 font-bricolage-grotesque"># {payslip.payslipNumber}</h3>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-10 bg-slate-50/10">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <User size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Employee Details</span>
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                 <p className="text-[10px] text-slate-500 font-bold">{employee.employeeCode}</p>
                 <p className="text-[10px] text-slate-500 font-bold">{employee.designation}</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <Calendar size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Cycle Info</span>
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-900">{monthNames[month-1]} {year}</p>
                 <p className="text-[10px] text-slate-500 font-bold">Dept: {department || "N/A"}</p>
                 <p className="text-[10px] text-emerald-600 font-black">STATUS: PAID</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <Wallet size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Contact Info</span>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Mail size={12} className="text-slate-400" />
                    <span>{employee.emailOfficial}</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Smartphone size={12} className="text-slate-400" />
                    <span>{employee.phone || "Not Provided"}</span>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-center shadow-xl shadow-slate-900/10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Net Payable Amount</p>
              <p className="text-3xl font-bold font-bricolage-grotesque">₹{payslip.netPay.toLocaleString()}</p>
           </div>
        </div>

        {/* Breakup Section */}
        <div className="p-10 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Earnings */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                       <TrendingUp className="text-emerald-500" size={18} />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Earnings</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">Amount (INR)</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500 font-bold">Gross Earnings</span>
                       <span className="text-slate-900 font-black">₹{payslip.grossEarnings.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center text-emerald-600 font-bold">
                       <span className="text-xs font-black uppercase tracking-widest">Total Earnings</span>
                       <span className="text-lg">₹{payslip.grossEarnings.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              {/* Deductions */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                       <TrendingDown className="text-rose-500" size={18} />
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Deductions</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">Amount (INR)</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500 font-bold">Employee PF (EPF)</span>
                       <span className="text-slate-900 font-black">₹{payslip.pfEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500 font-bold">Employee ESI</span>
                       <span className="text-slate-900 font-black">₹{payslip.esiEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500 font-bold">Income Tax (TDS)</span>
                       <span className="text-slate-900 font-black">₹{payslip.tds.toLocaleString()}</span>
                    </div>
                    {payslip.otherDeductions > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-bold">Other Deductions</span>
                        <span className="text-slate-900 font-black">₹{payslip.otherDeductions.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center text-rose-600 font-bold">
                       <span className="text-xs font-black uppercase tracking-widest">Total Deductions</span>
                       <span className="text-lg">₹{(payslip.pfEmployee + payslip.esiEmployee + payslip.tds + (payslip.otherDeductions || 0)).toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Grand Total Footer */}
           <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-500 text-white rounded-[24px]">
                       <ShieldCheck size={32} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Take-Home Salary (Net Pay)</p>
                       <p className="text-3xl sm:text-5xl font-bold font-bricolage-grotesque">₹{payslip.netPay.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md text-center shrink-0 min-w-[240px]">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Employer Contribution</p>
                    <div className="flex justify-around items-center">
                       <div>
                          <p className="text-xs font-bold">PF</p>
                          <p className="text-sm font-black">₹{payslip.pfEmployer.toLocaleString()}</p>
                       </div>
                       <div className="w-px h-8 bg-white/10" />
                       <div>
                          <p className="text-xs font-bold">ESI</p>
                          <p className="text-sm font-black">₹{payslip.esiEmployer.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl opacity-50" />
           </div>

           {/* Disclaimers */}
           <div className="pt-10 flex flex-col md:flex-row justify-between items-end gap-10 opacity-60">
              <div className="max-w-md">
                 <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Legal Disclaimer</h5>
                 <p className="text-[9px] text-slate-500 leading-relaxed font-medium">This is a computer-generated document and does not require a physical signature. All amounts mentioned are in Indian Rupees (INR). For any queries, reach out to the payroll department within 5 working days of disbursement.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 mx-auto mb-2 flex items-center justify-center text-slate-300">
                    <Printer size={24} />
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Digitally Verified Document</p>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
