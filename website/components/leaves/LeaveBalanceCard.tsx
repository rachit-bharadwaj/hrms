"use client";

import { Info } from "lucide-react";

interface LeaveBalance {
  leaveTypeName: string;
  leaveTypeCode: string;
  openingBalance: number;
  accrued: number;
  availed: number;
  closingBalance: number;
}

export default function LeaveBalanceCard({
  balance,
}: {
  balance: LeaveBalance;
}) {
  const getColors = (code: string) => {
    switch (code) {
      case "CL":
        return "from-blue-500 to-indigo-600 shadow-blue-200";
      case "SL":
        return "from-rose-500 to-red-600 shadow-red-200";
      case "EL":
        return "from-emerald-500 to-teal-600 shadow-emerald-200";
      default:
        return "from-slate-700 to-slate-900 shadow-slate-200";
    }
  };

  const percentage = Math.max(
    0,
    Math.min(
      100,
      (balance.closingBalance / (balance.openingBalance + balance.accrued)) *
        100,
    ),
  );

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${getColors(balance.leaveTypeCode)} p-6 rounded-[32px] text-white shadow-xl group transition-all duration-500 hover:-translate-y-2`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest">
              {balance.leaveTypeName}
            </h4>
            <p className="text-4xl font-bold font-bricolage-grotesque mt-1">
              {balance.closingBalance}
            </p>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-1">
              Days Available
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform">
            <Info size={20} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-80">
            <span>Availed: {balance.availed}</span>
            <span>Total: {balance.openingBalance + balance.accrued}</span>
          </div>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
    </div>
  );
}
