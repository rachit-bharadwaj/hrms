"use client";

const data = [
  {
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    days: 5,
  },
  {
    name: "Helga Miller",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    days: 12,
  },
  {
    name: "Jacob Bold",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    days: 7,
  },
  {
    name: "Michael Brown",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    days: 14,
  },
  {
    name: "Anna Walker",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    days: 12,
  },
  {
    name: "Elena Harris",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
    days: 18,
  },
];

export default function AverageClosingTime() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-6">
      <p className="text-slate-500 tracking-tight text-xl font-bricolage-grotesk">
        Average vacancy closing time
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-slate-900">{item.name}</span>
            </div>
            <div className="flex flex-col items-center justify-center min-w-[50px] bg-blue-50 group-hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors">
              <span className="text-blue-600 tracking-tighter">
                {item.days}
              </span>
              <span className="text-xs font-bold text-blue-400 uppercase">
                days
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
