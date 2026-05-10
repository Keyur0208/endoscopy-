export const CalculateAge = (
  birthdate: string | Date
): { age: number; ageUnit: 'Year' | 'Month' | 'Day' } => {
  const birth = new Date(birthdate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return { age: years, ageUnit: 'Year' };
  }

  if (months > 0) {
    return { age: months, ageUnit: 'Month' };
  }

  return { age: days, ageUnit: 'Day' };
};

export const GetDateDifference = (
  fromDate: string | Date,
  toDate: string | Date = new Date()
): { years: number; months: number; days: number } => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

export const toAgeBreakdown = (
  age?: number | null,
  ageUnit?: string | null,
  normalizeMonths = false
) => {
  if (age == null || Number.isNaN(Number(age))) return { years: 0, months: 0, days: 0 };

  const unit = String(ageUnit ?? '').toLowerCase();

  if (unit.startsWith('y')) return { years: Number(age), months: 0, days: 0 };
  if (unit.startsWith('m')) {
    const months = Number(age);
    if (!normalizeMonths) return { years: 0, months, days: 0 };
    return { years: Math.floor(months / 12), months: months % 12, days: 0 };
  }
  if (unit.startsWith('d')) return { years: 0, months: 0, days: Number(age) };

  return { years: Number(age), months: 0, days: 0 };
};
