import {View, Text, StyleSheet, ScrollView,} from "react-native";
import {MONTHS,} from "@/constants/mockData";
import {C, PADDING} from "@/constants/theme";
import {InsightCard} from "@/components/Home/InsightCard/InsightCard";
import {Calendar} from "@/components/Home/Calendar/Calendar";
import {Categories} from "@/components/Home/CategoriesInfo/Categories";


export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Time Tracker</Text>
      </View>

      <InsightCard streak={18} monthlyHours={125} monthlyGoal={160} dailyAvg={6.4}/>
      <Calendar/>
      <Categories/>
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
  // Hint
  hint: {
    fontSize: 11,
    color: C.textTert,
    textAlign: "center",
    marginTop: -4,
  },
});