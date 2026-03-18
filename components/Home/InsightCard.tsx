import {Text, View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {C} from "@/constants/theme";
import React from "react";

type Props = {
  streak:number;
  monthlyHours:number;
  monthlyGoal:number;
  dailyAvg:number;
}
export function InsightCard({streak, monthlyHours, monthlyGoal, dailyAvg}: Props) {
  const progress = Math.min(monthlyHours / monthlyGoal, 1);
  const progressPct = Math.round(progress * 100);
  return(
    <View style={styles.insightCard}>
      <View style={styles.insightTopRow}>
        <Text style={styles.insightTitle}>INSIGHTS</Text>
        <View style={styles.goalBadge}>
          <Ionicons name="flag-outline" size={10} color={C.accent} />
          <Text style={styles.goalBadgeText}>{monthlyHours} / {monthlyGoal} h</Text>
        </View>
      </View>

      <View style={styles.goalTrack}>
        <View style={[styles.goalFill, { width: `${progressPct}%` }]} />
      </View>
      <Text style={styles.goalSubtext}>{progressPct}% of monthly goal</Text>

      <View style={styles.insightGrid}>
        <View style={styles.insightCol}>
          <Ionicons name="flame" size={13} color="#FB923C" />
          <View style={styles.insightValueRow}>
            <Text style={styles.insightNum}>{streak}</Text>
            <Text style={styles.insightUnit}>d</Text>
          </View>
          <Text style={styles.insightLabel}>streak</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.insightCol}>
          <Ionicons name="time-outline" size={13} color={C.accent} />
          <View style={styles.insightValueRow}>
            <Text style={styles.insightNum}>{monthlyHours}</Text>
            <Text style={styles.insightUnit}>h</Text>
          </View>
          <Text style={styles.insightLabel}>this month</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.insightCol}>
          <Ionicons name="trending-up-outline" size={13} color={C.accent} />
          <View style={styles.insightValueRow}>
            <Text style={styles.insightNum}>{dailyAvg}</Text>
            <Text style={styles.insightUnit}>h</Text>
          </View>
          <Text style={styles.insightLabel}>daily avg</Text>
        </View>
      </View>
    </View>
    )

}


const styles=StyleSheet.create({
  // Insight card
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