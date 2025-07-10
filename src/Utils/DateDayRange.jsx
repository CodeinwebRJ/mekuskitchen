export function getDatesForDayInRange(startDate, endDate, dayName) {
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = dayMap[dayName];
  if (targetDay === undefined) return [];

  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let current = new Date(start);
  while (current.getDay() !== targetDay) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    const day = String(current.getDate()).padStart(2, "0");
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const year = current.getFullYear();
    dates.push(`${day}-${month}-${year}`);
    current.setDate(current.getDate() + 7);
  }

  return dates;
}
