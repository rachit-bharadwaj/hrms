import { StatCardProps } from "@/types/dashboard";
import { TrendingDown, TrendingUp } from "lucide-react";
import { JSX } from "react";

export default function StatCard({
  title,
  value,
  subtext,
  trend,
  progress,
}: StatCardProps): JSX.Element {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              trend.isUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        <p className="text-slate-400 text-xs font-medium">{subtext}</p>
      </div>

      {progress && (
        <div className="mt-2 flex flex-col gap-2">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${progress.color || "bg-blue-500"}`}
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
