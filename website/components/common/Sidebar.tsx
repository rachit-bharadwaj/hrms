"use client";

import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Circle,
  HelpCircle,
  Mail,
  Menu,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`p-3 rounded-xl transition-all duration-200 group relative flex items-center justify-center ${
        isActive
          ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-primary border border-slate-100/50"
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/80"
      }`}
    >
      <div className="relative">
        <Icon
          size={20}
          strokeWidth={isActive ? 2 : 1.8}
          className={isActive ? "text-primary" : ""}
        />
        {label === "Activity" && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute left-[calc(100%+16px)] px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none z-[100] shadow-xl">
        {label}
        {/* Tooltip Arrow */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: BarChart3, label: "Analytics", href: "/" },
    { icon: Circle, label: "Activity", href: "/activity" },
    { icon: User, label: "Users", href: "/users" },
    { icon: Briefcase, label: "Jobs", href: "/jobs" },
    { icon: Building2, label: "Company", href: "/company" },
    { icon: Calendar, label: "Schedule", href: "/schedule" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Users, label: "Team", href: "/team" },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/help" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-6 bg-[#F9FAFB] border-r border-slate-200/60 z-[60]">
      {/* Top Menu Icon */}
      <div className="mb-8 p-3 cursor-pointer hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700">
        <Menu size={22} strokeWidth={1.8} />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-3">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom Icons */}
      <div className="mt-auto flex flex-col gap-3">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </aside>
  );
}
