import {StyleSheet} from "react-native";
import {C, CARD_PAD, CIRCLE} from "@/constants/theme"

export const stylesCalendar =StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: CARD_PAD,
  },

  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthName: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
    letterSpacing: -0.3,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
  },

  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textTert,
    textAlign: "center",
  },
  dayCol: {
    width:CIRCLE,
    alignItems: "center",
    justifyContent: "center",
  },

  // Grid
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: {
    backgroundColor: C.accent,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: C.blue4,
  },
  dayCircleSelected: {
    backgroundColor: C.selected,
    shadowColor: C.selected,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  dayNum: {
    fontSize: 16,
    fontWeight: "500",
    color: C.textTert,
  },
  dayNumActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dayNumToday: {
    color: C.blue4,
    fontWeight: "700",
  },
  dayNumSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 14,
    justifyContent: "flex-end",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 10,
    color: C.textTert,
  },
})