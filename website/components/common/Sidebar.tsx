"use client";

import api from "@/lib/api";
import { Logo } from "@/partials/common";
import {
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  LockKeyhole,
  ListTodo,
  Menu,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  isActive?: boolean;
  isExpanded?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isExpanded,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`p-3 rounded-xl transition-all duration-200 group relative flex items-center ${
        isExpanded ? "justify-start gap-3 w-full px-4" : "justify-center"
      } ${
        isActive
          ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-primary border border-slate-100/50"
          : "text-slate-500 hover:text-slate-600 hover:bg-slate-100/80"
      }`}
    >
      <div className="relative shrink-0">
        <Icon
          size={20}
          strokeWidth={isActive ? 2 : 1.8}
          className={isActive ? "text-primary" : ""}
        />
        {label === "Activity" && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>

      {isExpanded && (
        <span
          className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
            isActive ? "text-slate-900" : "text-slate-500"
          }`}
        >
          {label}
        </span>
      )}

      {/* Tooltip (only when collapsed) */}
      {!isExpanded && (
        <div className="absolute left-[calc(100%+16px)] px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none z-100 shadow-xl">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
        </div>
      )}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data.status === "success") {
          setPermissions(response.data.user.permissions || []);
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    };
    fetchUser();

    document.documentElement.style.setProperty(
      "--sidebar-width",
      isExpanded ? "240px" : "72px",
    );
  }, [isExpanded]);

  const navItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      href: "/",
      permission: "dashboard.view",
    },
    {
      icon: Briefcase,
      label: "Employees",
      href: "/employees",
      permission: "employees.view",
    },
    {
      icon: Building2,
      label: "Departments",
      href: "/departments",
      permission: "departments.view",
    },
    {
      icon: CheckCircle2,
      label: "Attendance",
      href: "/attendance",
      permission: "attendance.view",
    },
    {
      icon: Calendar,
      label: "Leaves",
      href: "/leaves",
      permission: ["leaves.view_own", "leaves.view_all"],
    },
    {
      icon: CalendarDays,
      label: "Holidays",
      href: "/calendar",
      permission: "holidays.view",
    },
    {
      icon: ClipboardCheck,
      label: "Approvals",
      href: "/leaves/requests",
      permission: "leaves.approve",
    },
    {
      icon: Banknote,
      label: "Payroll",
      href: "/payroll",
      permission: ["payroll.view_own", "payroll.view_all"],
    },
    {
      icon: ListTodo,
      label: "Tasks",
      href: "/tasks",
      permission: ["tasks.view_own", "tasks.view_all"],
    },
    { icon: User, label: "Users", href: "/users", permission: "users.manage" },
    {
      icon: Shield,
      label: "Roles",
      href: "/roles",
      permission: "roles.manage",
    },
    {
      icon: LockKeyhole,
      label: "Permissions",
      href: "/permissions",
      permission: "roles.manage",
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    const required = Array.isArray(item.permission)
      ? item.permission
      : [item.permission];
    return required.some((p) => permissions.includes(p));
  });

  const bottomItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/help" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 ease-in-out bg-[#F9FAFB] border-r border-slate-200/60 z-60 p-5 ${
        isExpanded ? "w-[240px] items-start" : "w-[72px] items-center"
      }`}
    >
      {/* Top Menu Icon */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mb-8 cursor-pointer hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700 flex items-center ${
          isExpanded ? "w-full gap-3" : "justify-center"
        }`}
      >
        <Menu size={22} strokeWidth={1.8} />
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Logo size={5} />
            <h1 className="text-xl font-bricolage-grotesque">Harbor</h1>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav
        className={`flex-1 flex flex-col gap-3 ${isExpanded ? "w-full" : ""}`}
      >
        {filteredNavItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
            isExpanded={isExpanded}
          />
        ))}
      </nav>

      {/* Bottom Icons */}
      <div
        className={`mt-auto flex flex-col gap-3 ${isExpanded ? "w-full" : ""}`}
      >
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </aside>
  );
}
