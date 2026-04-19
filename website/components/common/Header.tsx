"use client";

import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 sticky top-0 z-50">
      {/* Left: Mobile Menu & Logo & Breadcrumb */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="pl-2 font-medium text-slate-600">Dashboard</span>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-slate-400 group-focus-within:text-primary transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search by Candidates, Jobs, Companies"
            className="w-full h-10 pl-11 pr-4 bg-slate-50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}

      <div className="ml-2 w-9 h-9 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:border-primary transition-colors">
        {/* Using a high-quality avatar placeholder */}
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}
