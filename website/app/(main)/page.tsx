"use client";

import { StatsCards } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <StatsCards />
    </div>
  );
}
