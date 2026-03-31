import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import CustomPicker from "@/components/CustomPicker";
import {
  createActivity,
  deleteActivity,
  fetchActivities,
} from "@/lib/api/activities";
import {SafeAreaView} from "react-native-safe-area-context";

export type CategoryKey = "deep" | "study" | "gym" | "social" | "rest" | "";

export type Activity = {
  id: string;
  date: string;
  category: CategoryKey;
  hours: number;
  created_at: string;
};

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "deep", label: "Deep Work" },
  { key: "study", label: "Study" },
  { key: "gym", label: "Gym" },
  { key: "social", label: "Social" },
  { key: "rest", label: "Rest" },
];

export default function DayScreen() {
  const { day } = useLocalSearchParams();
  const [category, setCategory] = useState<CategoryKey>("");
  const [hours, setHours] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([]);

  const selectedDay = new Date(day as string);
  const dayNum = selectedDay.getDate();
  const date = selectedDay.toISOString().split("T")[0];

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchActivities(new Date(day as string));
        setActivities(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (day) {
      loadActivities();
    }
  }, [day]);

  const handleAdd = async () => {
    if (hours.trim() === "") {
      Alert.alert("This field shouldn't be empty");
      return;
    }

    if(!category){
      Alert.alert("Choose a category");
    }
    const numericHours = Number(hours);
    if (!numericHours || numericHours <= 0) {
      Alert.alert("Should be more than 0");
      return;
    }
    if(numericHours>=24){
      Alert.alert("Can't be more than 24")
      return;
    }

    if (!category) {
      Alert.alert("Select category");
      return;
    }

    try {
      const newItem = await createActivity({
        date,
        category,
        hours: numericHours,
      });

      setActivities((prev) => [newItem, ...prev]);

      setCategory("");
      setHours("");
    } catch (e) {
      console.error(e);
      Alert.alert("Error creating activity");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);

      setActivities((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to delete");
    }
  };

  const handleReset = () => {
    setActivities([]);
    setCategory("");
    setHours("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#20297A" />
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Day {dayNum}</Text>
              <Text style={styles.headerSub}>{date}</Text>
            </View>

            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>DAY SUMMARY</Text>
            <Text style={styles.totalText}>Totally {}</Text>
            <Text style={styles.insightHint}>
              Add activities and track how your day was spent
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Add Activity</Text>

            <Text style={styles.label}>Category</Text>
              <CustomPicker
                selectedValue={category}
                onValueChange={(v) => setCategory(v as CategoryKey)}
                options={CATEGORIES.map((c) => ({
                  label: c.label,
                  value: c.key,
                }))}
              />

            <Text style={[styles.label, styles.labelSpacing]}>Hours</Text>

            <View style={styles.inputRow}>
              <TextInput
                value={hours}
                onChangeText={setHours}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#A5AEC4"
                style={styles.input}
              />

              <Pressable style={styles.addBtn} onPress={handleAdd}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            </View>
          </View>

          {activities.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Activities</Text>

              <View style={styles.activitiesList}>
                {activities.map((item) => (
                  <View key={item.id} style={styles.item}>
                    <View style={styles.itemLeft}>
                      <View style={styles.dot} />
                      <View>
                        <Text style={styles.itemTitle}>
                          {CATEGORIES.find((c) => c.key === item.category)?.label}
                        </Text>
                        <Text style={styles.itemSub}>{item.hours} h</Text>
                      </View>
                    </View>

                    <Pressable
                      style={styles.trashBtn}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Feather name="trash-2" size={18} color="#D84D4D" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable
            style={[styles.bottomBtn, styles.resetBtn]}
            onPress={handleReset}
          >
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>

          <Pressable style={[styles.bottomBtn, styles.saveBtn]}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  root: {
    flex: 1,
    backgroundColor: "#F3F6FC",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#E9EEF8",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#16224A",
    letterSpacing: -0.3,
  },

  headerSub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: "#91A0C2",
  },

  headerPlaceholder: {
    width: 40,
    height: 40,
  },

  insightCard: {
    backgroundColor: "#071D49",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 18,
  },

  insightLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#7F95C8",
    marginBottom: 14,
  },

  totalText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.8,
  },

  insightHint: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#93A3C7",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#17244D",
    letterSpacing: -0.5,
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9AA6C0",
    marginBottom: 10,
    marginLeft: 2,
  },

  labelSpacing: {
    marginTop: 16,
  },

  fieldWrap: {
    minHeight: 58,
    borderWidth: 1.2,
    borderColor: "#DCE3F0",
    borderRadius: 22,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  input: {
    flex: 1,
    height: 58,
    borderWidth: 1.2,
    borderColor: "#DCE3F0",
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 17,
    fontWeight: "600",
    color: "#17203A",
    backgroundColor: "#FFFFFF",
  },

  addBtn: {
    height: 58,
    minWidth: 112,
    borderRadius: 22,
    backgroundColor: "#2F6CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 18,
  },

  addBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  activitiesList: {
    gap: 12,
    marginTop: 6,
  },

  item: {
    minHeight: 74,
    borderRadius: 22,
    backgroundColor: "#F7F9FD",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#3F82FF",
  },

  itemTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#18244A",
    letterSpacing: -0.2,
  },

  itemSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#8C9ABD",
  },

  trashBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: "#F3F6FC",
    flexDirection: "row",
    gap: 12,
  },

  bottomBtn: {
    flex: 1,
    height: 58,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  resetBtn: {
    backgroundColor: "#E9EEF8",
  },

  resetText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#20315F",
  },

  saveBtn: {
    backgroundColor: "#1F2B7B",
    shadowColor: "#1F2B7B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },

  saveText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});