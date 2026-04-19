"use client";

import api from "@/lib/api";
import { ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data.status === "success") {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("harbor_token");
    router.push("/login");
  };

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

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer border border-transparent hover:border-slate-200 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 group-hover:border-primary transition-colors">
            {!isLoading && userData?.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
          </div>
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2 z-100 animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                User Account
              </p>
              <p className="text-sm font-medium text-slate-900 truncate">
                {isLoading ? "Loading..." : userData?.name || "User"}
              </p>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group">
              <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary/10 transition-colors">
                <Settings size={14} />
              </div>
              <span>Account Settings</span>
            </button>

            <div className="h-px bg-slate-100 my-1 mx-2" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all group"
            >
              <div className="p-1.5 rounded-lg bg-red-100/50 group-hover:bg-red-100 transition-colors">
                <LogOut size={14} />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
