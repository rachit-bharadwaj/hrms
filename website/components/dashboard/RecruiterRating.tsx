"use client";

import { TrendingUp } from "lucide-react";

const recruiters = [
  {
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    activeVacancies: 8,
    responses: 283,
    responsesTrend: "+36",
    hired: { current: 8, total: 10 },
    rating: 80,
  },
  {
    name: "Helga Miller",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    activeVacancies: 3,
    responses: 250,
    responsesTrend: "+42",
    hired: { current: 2, total: 4 },
    rating: 50,
  },
];

export default function RecruiterRating() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <p className="text-slate-500 tracking-tight text-xl font-bricolage-grotesk">
        Recruiters rating
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-50 text-slate-500">
              <th className="pb-4">Recruiter</th>
              <th className="pb-4">Active vacancies</th>
              <th className="pb-4">Number of responses</th>
              <th className="pb-4">Employees hired</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recruiters.map((recruiter) => (
              <tr
                key={recruiter.name}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={recruiter.avatar}
                        alt={recruiter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-slate-900">{recruiter.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-slate-700">
                    {recruiter.activeVacancies}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700">
                      {recruiter.responses}
                    </span>
                    <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <TrendingUp size={10} />
                      {recruiter.responsesTrend}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-4 text-slate-700">
                    <span>
                      {recruiter.hired.current} out of {recruiter.hired.total}
                    </span>
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-slate-100"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-blue-500"
                          strokeWidth="3"
                          strokeDasharray={`${recruiter.rating}, 100`}
                        />
                      </svg>
                      <span className="absolute text-blue-600 text-xs">
                        {recruiter.rating}%
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
