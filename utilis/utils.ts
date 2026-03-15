export function getDaysInMonth(currentYear:number, currentMonth:number){
  return new Date(currentYear, currentMonth+1, 0).getDate();
}

export function generateMonth(currentYear:number, currentMonth:number) {
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    const date = new Date(currentYear, currentMonth, dayNumber);

    return {
      date: date.toISOString().split("T")[0], // "2026-02-03"
      day: dayNumber,
      weekDay: date.getDay(), // 0-6
    };
  });
}