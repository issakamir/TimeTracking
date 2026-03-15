import React, {useState} from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import {router} from "expo-router";
import {getDaysInMonth, generateMonth} from "@/utilis/utils";

const CATEGORIES = [
  { key: "deep", label: "Deep Work" },
  { key: "study", label: "Study" },
  { key: "gym", label: "Gym" },
  { key: "social", label: "Social" },
  { key: "rest", label: "Rest" },
];

export default function HomeScreen() {
  const today=new Date();

  const[currentYear, setCurrentYear]= useState(today.getFullYear());
  const[currentMonth, setCurrentMonth]= useState(today.getMonth());

  const monthData=generateMonth(currentYear, currentMonth);

  const MONTHS= [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  const firstWeekDay = monthData[0]?.weekDay ?? 0;

  const leadingEmpty = Array.from({ length: firstWeekDay });

  const totalCells = leadingEmpty.length + monthData.length;
  const trailingEmpty = Array.from({
    length: totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7),
  });

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Life Heatmap</Text>
        <Text style={styles.subtitle}>Track your life patterns</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.legendRow}>
          {CATEGORIES.map((c) => (
            <View key={c.key} style={styles.legendItem}>
              <View style={styles.dot} />
              <Text style={styles.legendText}>{c.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.calendarHeader}>
          <Text style={styles.cardTitle}>February 2026</Text>

          <View style={styles.navRow}>
            <Pressable style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹</Text>
            </Pressable>
            <Pressable style={styles.navBtn}>
              <Text style={styles.navBtnText}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.weekdays}>
          {["M","T", "W", "T", "F", "S", "S"].map((d) => (
            <Text key={d} style={styles.weekdayText}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {leadingEmpty.map((_, i) => (
            <View key={`lead-&{i}`} style={[styles.dayCell, styles.emptyCell]}></View>
          ))}

          {monthData.map((d) => (
            <Pressable
            key={d.date}
            style={styles.dayCell}
            onPress={() => {router.push(`/day/${d.date}`)}}>
              <Text style={styles.dayNum}>{d.day}</Text>
            </Pressable>
          ))}
          {trailingEmpty.map((_, i) => (
            <View key={`trail-${i}`} style={[styles.dayCell, styles.emptyCell]} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.summaryTitle}>SUMMARY</Text>

        <SummaryRow label="Deep Work" value="38h" progress={0.65} />
        <SummaryRow label="Rest" value="31h" progress={0.55} />
        <SummaryRow label="Social" value="25h" progress={0.45} />
        <SummaryRow label="Study" value="19.5h" progress={0.35} />
        <SummaryRow label="Gym" value="12h" progress={0.22} />
      </View>
    </ScrollView>
  );
}

function SummaryRow({label, value, progress,}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryTop}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#F6F7FB",
    gap: 14,
  },

  header: {
    paddingTop: 50,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },

  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },
  legendText: {
    fontSize: 13,
    color: "#111827",
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  navRow: {
    flexDirection: "row",
    gap: 10,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  navBtnText: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "600",
    marginTop: -1,
  },

  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  weekdayText: {
    width: 36,
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  dayCell: {
    width: 42,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  dayNum: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 16,
  },
  dayHours: {
    fontSize: 11,
    color: "#374151",
    marginTop: 2,
  },

  // “интенсивность” (потом привяжем к часу/минутам)
  level0: { backgroundColor: "#FFFFFF" },
  level1: { backgroundColor: "#DCFCE7", borderColor: "#BBF7D0" },
  level2: { backgroundColor: "#86EFAC", borderColor: "#4ADE80" },
  level3: { backgroundColor: "#22C55E", borderColor: "#16A34A" },

  emptyCell: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF0F4",
  },
  emptyText: { color: "transparent" },

  summaryTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: "#6B7280",
    fontWeight: "800",
    marginBottom: 6,
  },
  summaryRow: {
    marginTop: 12,
    gap: 8,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  summaryValue: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#EEF2F7",
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },
});