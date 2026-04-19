"use client";

export default function CandidateStats() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const data = [
    { received: 3, hired: 0 },
    { received: 16, hired: 0 },
    { received: 14, hired: 2 },
    { received: 6, hired: 0 },
    { received: 12, hired: 0 },
    { received: 10, hired: 4 },
    { received: 4, hired: 0 },
    { received: 2, hired: 0 },
    { received: 6, hired: 0 },
    { received: 14, hired: 4 },
    { received: 8, hired: 0 },
    { received: 10, hired: 0 },
    { received: 12, hired: 2 },
    { received: 3, hired: 0 },
    { received: 2, hired: 0 },
    { received: 12, hired: 2 },
    { received: 16, hired: 0 },
    { received: 10, hired: 6 },
    { received: 4, hired: 0 },
    { received: 6, hired: 0 },
    { received: 12, hired: 6 },
    { received: 16, hired: 0 },
    { received: 12, hired: 0 },
    { received: 6, hired: 4 },
    { received: 2, hired: 0 },
    { received: 4, hired: 3 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bricolage-grotesk text-slate-500 tracking-tight text-xl">
          Candidate statistics
        </h3>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-100" />
            <span className="text-slate-500">Received responses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-slate-500">Candidates hired</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end gap-1.5 overflow-hidden">
        {days.map((day, i) => {
          const item = data[i % data.length];
          const receivedHeight = (item.received / 20) * 100;
          const hiredHeight = (item.hired / 20) * 100;

          return (
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div className="relative w-full h-48 flex items-end justify-center">
                {/* Received Bar */}
                <div
                  className="w-full bg-blue-50 hover:bg-blue-100 transition-colors rounded-t-sm"
                  style={{ height: `${receivedHeight}%` }}
                />
                {/* Hired Bar (Stacked) */}
                {item.hired > 0 && (
                  <div
                    className="absolute w-full bg-blue-500 rounded-t-sm z-10"
                    style={{ height: `${hiredHeight}%` }}
                  />
                )}
              </div>
              <div className="text-[10px] font-bold text-slate-400">{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
