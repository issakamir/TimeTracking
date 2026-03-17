import React, { useState } from "react";
import {View, Text, StyleSheet, Pressable, ScrollView, Dimensions,} from "react-native";
import { router } from "expo-router";
import { generateMonth } from "@/utilis/utils";

const SW = Dimensions.get("window").width;
const CELL = Math.floor((SW - 40) / 7);

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const WEEKDAYS = ["M","T","W","T","F","S","S"];

const INTENSITY: Record<string, 0 | 1 | 2 | 3 | 4> = {
  "2026-03-02": 1,
  "2026-03-05": 2,
  "2026-03-10": 3,
  "2026-03-12": 4,
  "2026-03-15": 2,
  "2026-03-17": 3,
};

const LEVEL_BG = ["#F3F4F6", "#DCFCE7", "#86EFAC", "#4ADE80", "#16A34A"];
const LEVEL_TEXT = ["#6B7280", "#166534", "#15803D", "#14532D", "#F0FDF4"];

const SUMMARY = [
  { label: "Deep Work", value: "38h", progress: 0.65 },
  { label: "Rest",      value: "31h", progress: 0.55 },
  { label: "Social",    value: "25h", progress: 0.45 },
  { label: "Study",     value: "19h", progress: 0.35 },
  { label: "Gym",       value: "12h", progress: 0.22 },
];

export default function HomeScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const monthData = generateMonth(year, month);

  const firstWeekDay = monthData[0]?.weekDay ?? 0;
  const leadingCount = firstWeekDay === 0 ? 6 : firstWeekDay - 1;
  const leading = Array.from({ length: leadingCount });
  const total = leadingCount + monthData.length;
  const trailing = Array.from({ length: total % 7 === 0 ? 0 : 7 - (total % 7) });

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function isTodayDate(date: string) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === parseInt(date.split("-")[2], 10)
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Life Heatmap</Text>
        <Text style={styles.subtitle}>Track your daily patterns</Text>
      </View>

      <View style={styles.monthNav}>
        <Pressable onPress={prevMonth} style={styles.navBtn} hitSlop={12}>
          <Text style={styles.navArrow}>‹</Text>
        </Pressable>
        <View style={styles.monthLabelBlock}>
          <Text style={styles.monthLabel}>{MONTHS[month]}</Text>
          <Text style={styles.yearLabel}>{year}</Text>
        </View>
        <Pressable onPress={nextMonth} style={styles.navBtn} hitSlop={12}>
          <Text style={styles.navArrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={i} style={[styles.weekdayText, i >= 5 && styles.weekdayWeekend]}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {leading.map((_, i) => (
          <View key={`l-${i}`} style={styles.emptyCell} />
        ))}

        {monthData.map((d) => {
          const lvl = INTENSITY[d.date] ?? 0;
          const isWeekend = d.weekDay === 0 || d.weekDay === 6;
          const isToday = isTodayDate(d.date);
          return (
            <Pressable
              key={d.date}
              style={[
                styles.dayCell,
                { backgroundColor: LEVEL_BG[lvl] },
                isToday && styles.todayCell,
              ]}
              onPress={() => router.push(`/day/${d.date}`)}
            >
              <Text
                style={[
                  styles.dayNum,
                  { color: LEVEL_TEXT[lvl] },
                  isWeekend && lvl === 0 && styles.weekendText,
                  isToday && styles.todayText,
                ]}
              >
                {d.day}
              </Text>
            </Pressable>
          );
        })}

        {trailing.map((_, i) => (
          <View key={`t-${i}`} style={styles.emptyCell} />
        ))}
      </View>

      <View style={styles.legendRow}>
        <Text style={styles.legendHint}>Less</Text>
        {LEVEL_BG.map((bg, i) => (
          <View key={i} style={[styles.legendDot, { backgroundColor: bg }]} />
        ))}
        <Text style={styles.legendHint}>More</Text>
      </View>

      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>MONTHLY SUMMARY</Text>

      {SUMMARY.map((s) => (
        <SummaryRow key={s.label} {...s} />
      ))}
    </ScrollView>
  );
}

function SummaryRow({ label, value, progress }: { label: string; value: string; progress: number }) {
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },

  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 3,
    fontWeight: "500",
  },

  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  monthLabelBlock: {
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  yearLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  navArrow: {
    fontSize: 22,
    color: "#374151",
    fontWeight: "400",
    lineHeight: 26,
  },

  weekdayRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekdayText: {
    width: CELL,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#D1D5DB",
    letterSpacing: 0.5,
  },
  weekdayWeekend: {
    color: "#E5E7EB",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: CELL,
    height: CELL,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCell: {
    width: CELL,
    height: CELL,
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: "#16A34A",
  },
  dayNum: {
    fontSize: 13,
    fontWeight: "500",
  },
  weekendText: {
    color: "#D1D5DB",
  },
  todayText: {
    color: "#16A34A",
    fontWeight: "700",
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 10,
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendHint: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#9CA3AF",
    marginBottom: 16,
  },

  summaryRow: {
    marginBottom: 16,
    gap: 7,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  summaryValue: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  barTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },
  barFill: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#4ADE80",
  },
});