"use client";

import api from "@/lib/api";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Banknote, 
  Percent, 
  ShieldCheck,
  TrendingUp,
  Settings2
} from "lucide-react";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SalaryStructurePage({ params }: { params: any }) {
  const { id } = use(params) as { id: string };
  const [employee, setEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    effectiveFrom: new Date().toISOString().split('T')[0],
    basic: 0,
    hra: 0,
    otherAllowances: 0,
    otherEarnings: 0,
    pfApplicable: true,
    esiApplicable: true,
    tdsRatePercent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eRes, sRes] = await Promise.all([
        api.get(`/employees/${id}`),
        api.get(`/payroll/structure/${id}`)
      ]);
      setEmployee(eRes.data.data);
      if (sRes.data.data) {
        setFormData(sRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/payroll/structure/${id}`, formData);
      toast.success("Salary structure updated successfully");
    } catch (error) {
      toast.error("Failed to update structure");
    }
  };

  const gross = Number(formData.basic) + Number(formData.hra) + Number(formData.otherAllowances) + Number(formData.otherEarnings);

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Loading Configuration...</div>;

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8 pb-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
         <Link href="/employees" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-bold">
            <ArrowLeft size={16} />
            <span>Back to Employees</span>
         </Link>
         <h1 className="text-2xl font-bold text-slate-900 font-bricolage-grotesque">Salary Structure Configuration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Employee Profile Summary */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6">
                     <User size={32} />
                  </div>
                  <h3 className="text-xl font-bold font-bricolage-grotesque">{employee?.firstName} {employee?.lastName}</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{employee?.employeeCode}</p>
                  <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Gross Monthly</span>
                        <span className="text-xl font-bold font-bricolage-grotesque">₹{gross.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                     <ShieldCheck size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Compliance Status</h4>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-500">PF Applicable</span>
                     <div className={`w-10 h-5 rounded-full transition-all ${formData.pfApplicable ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-500">ESI Applicable</span>
                     <div className={`w-10 h-5 rounded-full transition-all ${formData.esiApplicable ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  </div>
               </div>
            </div>
         </div>

         {/* Configuration Form */}
         <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                  <div className="flex items-center gap-3 text-slate-900">
                     <Settings2 size={20} />
                     <h3 className="text-xl font-bold font-bricolage-grotesque">Structure Breakup</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">In INR / Month</span>
               </div>

               <div className="p-10 space-y-10">
                  {/* Earnings Block */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" size={18} />
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Earnings Components</h4>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Basic Salary</label>
                           <input 
                             type="number"
                             value={formData.basic}
                             onChange={e => setFormData({ ...formData, basic: Number(e.target.value) })}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">HRA</label>
                           <input 
                             type="number"
                             value={formData.hra}
                             onChange={e => setFormData({ ...formData, hra: Number(e.target.value) })}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Allowances</label>
                           <input 
                             type="number"
                             value={formData.otherAllowances}
                             onChange={e => setFormData({ ...formData, otherAllowances: Number(e.target.value) })}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Other Earnings</label>
                           <input 
                             type="number"
                             value={formData.otherEarnings}
                             onChange={e => setFormData({ ...formData, otherEarnings: Number(e.target.value) })}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Statutory Block */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <Percent className="text-blue-500" size={18} />
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Statutory & Tax</h4>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">TDS Rate (%)</label>
                           <input 
                             type="number"
                             step="0.01"
                             value={formData.tdsRatePercent}
                             onChange={e => setFormData({ ...formData, tdsRatePercent: Number(e.target.value) })}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Effective From</label>
                           <input 
                             type="date"
                             value={formData.effectiveFrom}
                             onChange={e => setFormData({ ...formData, effectiveFrom: e.target.value })}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                           />
                        </div>
                     </div>
                     <div className="flex gap-6 mt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input 
                             type="checkbox" 
                             checked={formData.pfApplicable}
                             onChange={e => setFormData({ ...formData, pfApplicable: e.target.checked })}
                             className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-0 transition-all"
                           />
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Apply PF Contribution</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input 
                             type="checkbox" 
                             checked={formData.esiApplicable}
                             onChange={e => setFormData({ ...formData, esiApplicable: e.target.checked })}
                             className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-0 transition-all"
                           />
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Apply ESI Contribution</span>
                        </label>
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-slate-900 text-white rounded-[22px] text-sm font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                  >
                     <Save size={18} />
                     <span>Save Salary Structure</span>
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
}

