import {View, Text, StyleSheet, ScrollView,} from "react-native";
import {C, PADDING} from "@/constants/theme";
import {InsightCard} from "@/components/Home/InsightCard";
import {Calendar} from "@/components/Home/Calendar/Calendar";
import {Categories} from "@/components/Home/CategoriesInfo/Categories";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";

type MonthlyStats = {
  totalHours: number;
  hoursByCategory: Record<string, number>;
};

export default function HomeScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<MonthlyStats>({
    totalHours: 0,
    hoursByCategory: {},
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const loadMonthData = async () => {
      try {
        setLoadingStats(true);

        const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

        const end = new Date(year, month + 1, 0);
        const endDate = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;

        const { data, error } = await supabase
          .from("activities")
          .select("date, category, hours")
          .gte("date", startDate)
          .lte("date", endDate);

        if (error) throw error;

        const activities = data ?? [];

        const totalHours = activities.reduce((sum, a) => sum + a.hours, 0);

        const hoursByCategory = activities.reduce((acc, a) => {
          acc[a.category] = (acc[a.category] || 0) + a.hours;
          return acc;
        }, {} as Record<string, number>);

        const datesSet = new Set(activities.map((a) => a.date));

        setStats({
          totalHours,
          hoursByCategory,
        });

        setActiveDates(datesSet);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStats(false);
      }
    };

    loadMonthData();
  }, [year, month]);

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.header}>Time Tracker</Text>
      </View>

      <InsightCard streak={18} monthlyHours={125} monthlyGoal={160} dailyAvg={6.4} />

      <Calendar
        todayDate={today}
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
        activeDates={activeDates}
      />

      <Categories
        totalHours={stats.totalHours}
        hoursByCategory={stats.hoursByCategory}
        loading={loadingStats}
        month={month}
      />
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  page: {
    paddingHorizontal: PADDING,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: C.bg,
    gap: 14,
  },

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
  hint: {
    fontSize: 11,
    color: C.textTert,
    textAlign: "center",
    marginTop: -4,
  },
});