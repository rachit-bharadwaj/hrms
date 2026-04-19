"use client";

import api from "@/lib/api";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  MapPin, 
  Globe,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import HolidayModal from "@/components/calendar/HolidayModal";

interface Holiday {
  id: string;
  date: string;
  name: string;
  type: string;
  location: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/holidays");
      setHolidays(res.data.data);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const holidayList = holidays.filter(h => {
    const d = new Date(h.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  return (
    <div className="flex flex-col gap-8 w-full p-4 md:p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-bricolage-grotesque tracking-tight">Company Calendar</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Official holidays and corporate event schedule.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
           >
              <Plus size={16} />
              <span>Add Holiday</span>
           </button>
           <div className="flex items-center gap-3 bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
              <button onClick={prevMonth} className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><ChevronLeft size={20} /></button>
              <div className="px-6 py-2 text-sm font-bold text-slate-700 min-w-[140px] text-center">{monthName} {year}</div>
              <button onClick={nextMonth} className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"><ChevronRight size={20} /></button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Calendar Grid */}
         <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/20">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                 <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
               ))}
            </div>
            <div className="grid grid-cols-7">
               {Array.from({ length: firstDayOfMonth(year, month) }).map((_, i) => (
                 <div key={`empty-${i}`} className="aspect-square border-b border-r border-slate-50 bg-slate-50/10" />
               ))}
               {Array.from({ length: daysInMonth(year, month) }).map((_, i) => {
                 const day = i + 1;
                 const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                 const holiday = holidays.find(h => h.date.startsWith(dateStr));
                 
                 return (
                   <div key={day} className={`aspect-square border-b border-r border-slate-50 p-3 relative group hover:bg-slate-50 transition-colors ${holiday ? 'bg-amber-50/20' : ''}`}>
                      <span className={`text-sm font-bold ${holiday ? 'text-amber-600' : 'text-slate-500'}`}>{day}</span>
                      {holiday && (
                        <div className="absolute inset-x-2 bottom-2 p-1.5 bg-amber-100 rounded-lg border border-amber-200 animate-in fade-in zoom-in">
                           <p className="text-[8px] font-black text-amber-700 uppercase tracking-tighter truncate">{holiday.name}</p>
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Holiday Sidebar */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-slate-900/10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-white/10 rounded-xl">
                        <Star size={18} className="text-amber-400" />
                     </div>
                     <h3 className="text-lg font-bold font-bricolage-grotesque">Holidays in {monthName}</h3>
                  </div>
                 {/* HR Add Button could go here */}
               </div>

               <div className="space-y-4">
                  {holidayList.length === 0 ? (
                    <p className="p-10 text-center text-xs font-bold text-slate-500 uppercase tracking-widest italic opacity-50 bg-white/5 rounded-[32px] border border-white/5">No holidays scheduled</p>
                  ) : (
                    holidayList.map(h => (
                      <div key={h.id} className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                               <p className="text-xs font-black">{new Date(h.date).getDate()}</p>
                            </div>
                            <div>
                               <h4 className="text-sm font-bold group-hover:text-amber-400 transition-colors">{h.name}</h4>
                               <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-0.5">{h.type}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MapPin size={14} className="text-slate-500" />
                            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">{h.location || "All"}</span>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Globe size={18} />
                   </div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Calendar Legend</h4>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-200" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Public Holiday</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company Event</span>
                   </div>
                   <div className="flex items-center gap-3 opacity-30">
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optional / Regional</span>
                   </div>
                </div>
            </div>
         </div>
      </div>

      <HolidayModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={fetchHolidays} 
      />
    </div>
  );
}

