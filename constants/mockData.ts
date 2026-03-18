export const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const WEEKDAYS = ["M","T","W","T","F","S","S"];

export const DEMO_ACTIVE = new Set([
  "2026-03-03","2026-03-05","2026-03-07",
  "2026-03-10","2026-03-12","2026-03-13",
  "2026-03-14","2026-03-17","2026-03-18",
]);

export const CATEGORIES = [
  { label: "Deep Work", hours: 38, icon: "bulb-outline",    color: "#4F46E5" },
  { label: "Rest",      hours: 31, icon: "moon-outline",    color: "#7C3AED" },
  { label: "Social",    hours: 25, icon: "people-outline",  color: "#0891B2" },
  { label: "Study",     hours: 19, icon: "book-outline",    color: "#D97706" },
  { label: "Gym",       hours: 12, icon: "barbell-outline", color: "#DC2626" },
];

export const MONTHLY_GOAL    = 160;
export const MONTHLY_CURRENT = 125;
export const GOAL_PROGRESS   = MONTHLY_CURRENT / MONTHLY_GOAL;
