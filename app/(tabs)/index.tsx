import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { generateMonth } from "@/utilis/utils";
import {
  CATEGORIES,
  DEMO_ACTIVE,
  GOAL_PROGRESS,
  MONTHLY_CURRENT,
  MONTHLY_GOAL,
  MONTHS,
  WEEKDAYS
} from "@/constants/mockData";
import {C, CARD_PAD, CIRCLE, PADDING} from "@/constants/theme";
import {InsightCard} from "@/components/Home/InsightCard";


export default function HomeScreen() {
  const today    = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [year, setYear]                 = useState(today.getFullYear());
  const [month, setMonth]               = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navRef   = useRef({ prev: () => {}, next: () => {} });

  function animateChange(fn: () => void) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      fn();
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  }

  function prevMonth() {
    animateChange(() => {
      setSelectedDate(null);
      if (month === 0) { setMonth(11); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    });
  }

  function nextMonth() {
    animateChange(() => {
      setSelectedDate(null);
      if (month === 11) { setMonth(0); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    });
  }

  navRef.current.prev = prevMonth;
  navRef.current.next = nextMonth;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 15 && Math.abs(gs.dy) < Math.abs(gs.dx),
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -50)     navRef.current.next();
        else if (gs.dx > 50) navRef.current.prev();
      },
    })
  ).current;

  const monthData     = generateMonth(year, month);
  const firstWeekDay  = monthData[0]?.weekDay ?? 0;
  const leadingCount = firstWeekDay === 0 ? 6 : firstWeekDay - 1;
  const total         = leadingCount + monthData.length;
  const trailingCount = total % 7 === 0 ? 0 : 7 - (total % 7);

  const allCells: (typeof monthData[0] | null)[] = [
    ...Array(leadingCount).fill(null),
    ...monthData,
    ...Array(trailingCount).fill(null),
  ];
  const weeks: (typeof monthData[0] | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) weeks.push(allCells.slice(i, i + 7));

  const totalHours = CATEGORIES.reduce((acc, c) => acc + c.hours, 0);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>

      <View style={styles.headerRow}>
        <Text style={styles.header}>Overview</Text>
        <Text style={styles.headerSub}>{MONTHS[today.getMonth()]} {today.getFullYear()}</Text>
      </View>

      <InsightCard streak={18} monthlyHours={125} monthlyGoal={160} dailyAvg={6.4}/>


      <View style={styles.card} {...panResponder.panHandlers}>
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={16} color={C.textSec} />
          </Pressable>
          <Text style={styles.monthName}>{MONTHS[month]} {year}</Text>
          <Pressable onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={16} color={C.textSec} />
          </Pressable>
        </View>

        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((d, i) => (
            <View key={i} style={styles.dayCol}>
              <Text style={styles.weekdayText}>{d}</Text>
            </View>
          ))}
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((d, di) => {
                if (!d) return <View key={di} style={styles.dayCol} />;

                const isActive   = DEMO_ACTIVE.has(d.date);
                const isToday    = d.date === todayStr;
                const isSelected = selectedDate === d.date;

                return (
                  <Pressable
                    key={d.date}
                    style={({ pressed }) => [styles.dayCol, pressed && { opacity: 0.6 }]}
                    onPress={() => router.push(`/day/${d.date}`)}
                  >
                    <View style={[
                      styles.dayCircle,
                      isActive && !isSelected && !isToday && styles.dayCircleActive,
                      isToday  && !isSelected             && styles.dayCircleToday,
                      isSelected                          && styles.dayCircleSelected,
                    ]}>
                      <Text style={[
                        styles.dayNum,
                        isActive && !isSelected && !isToday && styles.dayNumActive,
                        isToday  && !isSelected            && styles.dayNumToday,
                        isSelected                         && styles.dayNumSelected,
                      ]}>
                        {d.day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </Animated.View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: C.accent }]} />
            <Text style={styles.legendLabel}>logged day</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "transparent", borderWidth: 1.5, borderColor: C.blue4 }]} />
            <Text style={styles.legendLabel}>today</Text>
          </View>
        </View>
      </View>

      {/* Categories Card */}
      <View style={styles.card}>
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <Text style={styles.categoriesSubtitle}>This Month</Text>
        </View>

        {CATEGORIES.map((cat) => {
          const pct = Math.round((cat.hours / totalHours) * 100);
          return (
            <View key={cat.label} style={styles.categoryRow}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + "18" }]}>
                <Ionicons name={cat.icon as any} size={16} color={cat.color} />
              </View>
              <View style={styles.categoryContent}>
                <View style={styles.categoryTopRow}>
                  <Text style={styles.categoryName}>{cat.label}</Text>
                  <View style={styles.categoryMeta}>
                    <Text style={styles.categoryPct}>{pct}%</Text>
                    <Text style={styles.categoryHours}>{cat.hours}h</Text>
                  </View>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: cat.color }]} />
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.totalDivider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{totalHours}h</Text>
        </View>
      </View>

      <Text style={styles.hint}>Hold a day to open its details</Text>
    </ScrollView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: PADDING,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: C.bg,
    gap: 14,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: C.textTert,
  },

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
    marginBottom: 8,
    paddingHorizontal: 0, // Убедитесь, что здесь нет внутренних отступов
  },
  weekdayText: {
    // flex: 1 больше не нужен здесь, так как он есть в dayCol
    fontSize: 12,
    fontWeight: "600",
    color: C.textTert,
    textAlign: "center",
  },
  dayCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
  },

  // Grid
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
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

  // Hint
  hint: {
    fontSize: 11,
    color: C.textTert,
    textAlign: "center",
    marginTop: -4,
  },
});