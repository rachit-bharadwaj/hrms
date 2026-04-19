"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StatsCard } from "@/partials/dashboard";

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setStats(response.data.data.stats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-xl border border-slate-100 animate-pulse" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Total Employees"
        value={stats?.totalEmployees || 0}
        subtext="Active employees in system"
        trend={{ value: "+2", isUp: true }}
      />
      <StatsCard
        title="Departments"
        value={stats?.totalDepartments || 0}
        subtext="Total active departments"
      />
      <StatsCard
        title="Attendance Today"
        value={stats?.presentToday || 0}
        subtext="Employees marked present"
        progress={{ current: stats?.presentToday || 0, total: stats?.totalEmployees || 1 }}
      />
      <StatsCard
        title="Pending Leaves"
        value={stats?.pendingLeaves || 0}
        subtext="Requests awaiting approval"
        trend={{ value: stats?.pendingLeaves > 5 ? "High" : "Low", isUp: stats?.pendingLeaves > 5 }}
      />
      <StatsCard
        title="Active Tasks"
        value={stats?.activeTasks || 0}
        subtext="Tasks currently in progress"
        progress={{ current: stats?.activeTasks || 0, total: (stats?.activeTasks || 0) + 5 }}
      />
    </section>
  );
}
