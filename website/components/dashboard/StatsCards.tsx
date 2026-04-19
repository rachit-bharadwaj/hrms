import { StatsCard } from "@/partials/dashboard";

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Total responses"
        value="2 436"
        subtext="of candidates for the period"
        trend={{ value: "+15%", isUp: true }}
      />
      <StatsCard
        title="Responses today"
        value="98"
        subtext="candidates left a response"
        trend={{ value: "-10%", isUp: false }}
      />
      <StatsCard
        title="Total vacancies"
        value="49"
        subtext="active and closed vacancies"
        trend={{ value: "-10%", isUp: false }}
      />
      <StatsCard
        title="Closed vacancies"
        value="18 out of 49"
        subtext="active and closed vacancies"
        progress={{ current: 18, total: 49 }}
      />
      <StatsCard
        title="Recruitment plan"
        value="20 out of 61"
        subtext="of candidates for the period"
        progress={{ current: 20, total: 61 }}
      />
    </section>
  );
}
