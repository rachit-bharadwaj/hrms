import { calculatePF, calculateESI, calculateTDS, calculateWorkingDays } from "../utils/calculations";

describe("Payroll & Leave Logic Tests", () => {
  
  test("PF should be exactly 12% of basic", () => {
    expect(calculatePF(10000)).toBe(1200);
    expect(calculatePF(25000)).toBe(3000);
  });

  test("ESI should be 0 if gross > 21000", () => {
    const esi = calculateESI(25000);
    expect(esi.employee).toBe(0);
    expect(esi.employer).toBe(0);
  });

  test("ESI should be calculated correctly for low gross", () => {
    const esi = calculateESI(10000);
    expect(esi.employee).toBe(75); // 0.75%
    expect(esi.employer).toBe(325); // 3.25%
  });

  test("TDS should match percentage", () => {
    expect(calculateTDS(50000, 10)).toBe(5000);
  });

  test("Working days should exclude weekends", () => {
    // 2026-04-20 is Monday. Range 20th to 26th (Sunday)
    // Working days: 20, 21, 22, 23, 24 (5 days)
    const days = calculateWorkingDays("2026-04-20", "2026-04-26", []);
    expect(days).toBe(5);
  });

  test("Working days should exclude holidays", () => {
    // 2026-04-20 to 22 (Mon-Wed)
    // Holiday on 21st
    const days = calculateWorkingDays("2026-04-20", "2026-04-22", ["2026-04-21"]);
    expect(days).toBe(2);
  });

});
