import {StyleSheet} from "react-native";
import {C} from "@/constants/theme"

export const stylesInsight =StyleSheet.create({
  insightCard: {
    backgroundColor: C.dark,
    borderRadius: 24,
    padding: 22,
    gap: 12,
  },
  insightTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.38)",
    letterSpacing: 1.2,
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59,130,246,0.15)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
  },
  goalBadgeText: {
    fontSize: 11,
    color: C.accent,
    fontWeight: "500",
  },
  goalTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  goalFill: {
    height: 3,
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  goalSubtext: {
    fontSize: 10,
    color: "rgba(255,255,255,0.22)",
    marginTop: -4,
  },
  insightGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  insightCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  insightValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  insightNum: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  insightUnit: {
    fontSize: 13,
    color: "rgba(255,255,255,0.32)",
    marginBottom: 5,
  },
  insightLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.28)",
  },
  metricDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginVertical: 6,
  },
})