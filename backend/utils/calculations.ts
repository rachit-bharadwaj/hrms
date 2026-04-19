/**
 * Statutory Payroll and Leave Logic Utilities
 */

/**
 * Calculate PF (12% of basic)
 */
export const calculatePF = (basic: number) => {
  return Math.round(basic * 0.12);
};

/**
 * Calculate ESI (0.75% for employee, 3.25% for employer if gross <= 21000)
 */
export const calculateESI = (grossEarnings: number) => {
  if (grossEarnings > 21000) {
    return { employee: 0, employer: 0 };
  }
  return {
    employee: Math.round(grossEarnings * 0.0075),
    employer: Math.round(grossEarnings * 0.0325),
  };
};

/**
 * Calculate TDS based on percentage
 */
export const calculateTDS = (gross: number, rate: number) => {
  return Math.round((gross * rate) / 100);
};

/**
 * Calculate Leave Days excluding weekends and holidays
 */
export const calculateWorkingDays = (startDate: string, endDate: string, holidayDates: string[]) => {
  let count = 0;
  let curr = new Date(startDate);
  const end = new Date(endDate);
  
  while (curr <= end) {
    const dayOfWeek = curr.getDay();
    const dateStr = curr.toISOString().split('T')[0];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayDates.includes(dateStr);
    
    if (!isWeekend && !isHoliday) {
      count++;
    }
    curr.setDate(curr.getDate() + 1);
  }
  return count;
};
