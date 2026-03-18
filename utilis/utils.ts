export function generateMonth(currentYear: number, currentMonth: number) {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;

    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(dayNumber).padStart(2, '0');
    const dateString = `${currentYear}-${monthStr}-${dayStr}`;

    const dateObj = new Date(currentYear, currentMonth, dayNumber);

    return {
      date: dateString,
      day: dayNumber,
      weekDay: dateObj.getDay(),
    };
  });
}