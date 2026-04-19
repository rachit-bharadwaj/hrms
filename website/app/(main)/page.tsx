"use client";

import { 
  StatsCards, 
  CandidateStats, 
  CandidateSource, 
  RecruiterRating, 
  AverageClosingTime 
} from "@/components/dashboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Stats Cards */}
      <StatsCards />

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CandidateStats />
        </div>
        <div className="lg:col-span-1">
          <CandidateSource />
        </div>
      </div>

      {/* Tables / List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <RecruiterRating />
        </div>
        <div className="lg:col-span-2">
          <AverageClosingTime />
        </div>
      </div>
    </div>
  );
}
