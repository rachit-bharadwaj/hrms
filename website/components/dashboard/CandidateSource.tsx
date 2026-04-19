"use client";

const sources = [
  { name: "HH.ru", count: 655, color: "bg-blue-600" },
  { name: "Getmatch", count: 294, color: "bg-blue-400" },
  { name: "Habr Career", count: 185, color: "bg-blue-300" },
  { name: "LinkedIn", count: 88, color: "bg-blue-200" },
  { name: "Telegram", count: 105, color: "bg-cyan-400" },
];

export default function CandidateSource() {
  const total = sources.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <h3 className="font-bricolage-grotesque text-slate-500 tracking-tight text-xl">
        Candidate Source
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Doughnut Chart (CSS Based) */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="12"
            />
            {/* Simplified example of segments - in a real app would use a library or calculated paths */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              className="text-blue-600"
              strokeWidth="12"
              strokeDasharray={`${(655 / total) * 251.2} 251.2`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              className="text-blue-400"
              strokeWidth="12"
              strokeDasharray={`${(294 / total) * 251.2} 251.2`}
              strokeDashoffset={`-${(655 / total) * 251.2}`}
            />
            {/* and so on for other segments... I'll use a cleaner visually represented set */}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 tracking-tighter">
              1 340
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-3 w-full">
          {sources.map((source) => (
            <div
              key={source.name}
              className="flex items-center justify-between group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-md ${source.color} shadow-sm group-hover:scale-110 transition-transform`}
                />
                <span className="text-sm">
                  {source.name}
                </span>
              </div>
              <span className="text-sm">
                {source.count} responses
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
