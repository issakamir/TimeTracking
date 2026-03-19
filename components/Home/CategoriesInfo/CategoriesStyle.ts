import {C, CARD_PAD} from "@/constants/theme";
import {StyleSheet} from "react-native";

export const stylesCategories=StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: CARD_PAD,
  },
  // Categories
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
    letterSpacing: -0.3,
  },
  categoriesSubtitle: {
    fontSize: 11,
    color: C.textTert,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryContent: {
    flex: 1,
    gap: 6,
  },
  categoryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: C.text,
  },
  categoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryPct: {
    fontSize: 12,
    color: C.textTert,
  },
  categoryHours: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
    minWidth: 34,
    textAlign: "right",
  },
  progressTrack: {
    height: 4,
    backgroundColor: C.divider,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },

  // Total
  totalDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: C.textSec,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.5,
  },
})