"use client";

import { useEffect, useRef, useState } from "react";
import { Search, User, Building2, LayoutGrid, FileText, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface SearchResult {
  type: 'employee' | 'department' | 'user' | 'page';
  id: string;
  title: string;
  subtitle?: string;
  link: string;
  image?: string;
}

const STATIC_PAGES: SearchResult[] = [
  { type: 'page', id: 'p1', title: 'Dashboard', subtitle: 'Main analytics overview', link: '/' },
  { type: 'page', id: 'p2', title: 'Employees', subtitle: 'Staff directory and management', link: '/employees' },
  { type: 'page', id: 'p3', title: 'Departments', subtitle: 'Organizational structure', link: '/departments' },
  { type: 'page', id: 'p4', title: 'Attendance', subtitle: 'Daily logs and reports', link: '/attendance' },
  { type: 'page', id: 'p5', title: 'Leaves', subtitle: 'Leave management', link: '/leaves' },
  { type: 'page', id: 'p6', title: 'Payroll', subtitle: 'Salary and compensation', link: '/payroll' },
  { type: 'page', id: 'p7', title: 'Tasks', subtitle: 'To-do lists and assignments', link: '/tasks' },
  { type: 'page', id: 'p8', title: 'Users', subtitle: 'System access management', link: '/users' },
  { type: 'page', id: 'p9', title: 'Roles', subtitle: 'Access control levels', link: '/roles' },
  { type: 'page', id: 'p10', title: 'Permissions', subtitle: 'Granular access management', link: '/permissions' },
  { type: 'page', id: 'p11', title: 'Holidays', subtitle: 'Company holiday calendar', link: '/calendar' },
  { type: 'page', id: 'p12', title: 'Approvals', subtitle: 'Pending leave requests', link: '/leaves/requests' },
  { type: 'page', id: 'p13', title: 'Settings', subtitle: 'Application configuration', link: '/settings' },
  { type: 'page', id: 'p14', title: 'Help Center', subtitle: 'Support and documentation', link: '/help' },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/search/global?q=${query}`);
      const apiResults = response.data.data;
      
      // Filter static pages
      const pageResults = STATIC_PAGES.filter(page => 
        page.title.toLowerCase().includes(query.toLowerCase()) || 
        page.subtitle?.toLowerCase().includes(query.toLowerCase())
      );

      setResults([...pageResults, ...apiResults]);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(result.link);
    setIsOpen(false);
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'employee': return <User size={16} />;
      case 'department': return <Building2 size={16} />;
      case 'user': return <LayoutGrid size={16} />;
      case 'page': return <FileText size={16} />;
      default: return <Search size={16} />;
    }
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="text-primary animate-spin" />
          ) : (
            <Search
              size={18}
              className="text-slate-500 group-focus-within:text-primary transition-colors"
            />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search matches in pages, employees, departments..."
          className="w-full h-10 pl-11 pr-4 bg-slate-50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden z-101 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  index === selectedIndex ? 'bg-slate-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                   index === selectedIndex ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                }`}>
                  {result.image ? (
                    <img src={result.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : getIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-[11px] text-slate-400 truncate uppercase tracking-wider font-medium">
                      {result.subtitle}
                    </p>
                  )}
                </div>
                {index === selectedIndex && (
                  <ArrowRight size={14} className="text-primary animate-in slide-in-from-left-2" />
                )}
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {results.length} Results Found
            </p>
            <div className="flex items-center gap-2">
               <span className="px-1.5 py-0.5 rounded border border-slate-200 text-[9px] bg-white text-slate-400 font-bold">ESC</span>
               <span className="text-[9px] text-slate-400 font-bold">to close</span>
            </div>
          </div>
        </div>
      )}

      {isOpen && query.length > 1 && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center animate-in fade-in slide-in-from-top-2">
           <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Search size={24} className="text-slate-300" />
           </div>
           <p className="text-sm font-bold text-slate-900">No results found</p>
           <p className="text-xs text-slate-400 mt-1">We couldn't find anything matching "{query}"</p>
        </div>
      )}
    </div>
  );
}
