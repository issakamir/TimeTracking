import React, { useMemo, useState } from "react";
import {View, Text, StyleSheet, Pressable, TextInput, ScrollView, Platform,} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import {DAYS} from "@/app/(tabs)";

type CategoryKey = "deep" | "study" | "gym" | "social" | "rest";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "deep", label: "Deep Work" },
  { key: "study", label: "Study" },
  { key: "gym", label: "Gym" },
  { key: "social", label: "Social" },
  { key: "rest", label: "Rest" },
];

const PREVIEW_ITEMS = [
  { id: "1", category: "deep" as CategoryKey, hours: "4h" },
  { id: "2", category: "gym" as CategoryKey, hours: "1.5h" },
];

export default function DayScreenUI() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const selectedDay = DAYS.find(
    (d) => d.day === Number(day));

  const [category, setCategory] = useState<CategoryKey>("deep");
  const [hoursText, setHoursText] = useState("1");

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>{selectedDay?.day}</Text>
        <Text style={styles.total}>Всего: {selectedDay?.hours}</Text>

        <View style={styles.divider} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add an activity</Text>

          <Text style={styles.label}>КАТЕГОРИЯ</Text>
          <View style={styles.pickerOuter}>
            <View style={styles.pickerInner}>
              <Picker
                selectedValue={category}
                onValueChange={(v) => setCategory(v)}
                style={styles.picker}
                dropdownIconColor="#111827"
              >
                {CATEGORIES.map((c) => (
                  <Picker.Item key={c.key} label={c.label} value={c.key} />
                ))}
              </Picker>
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Amount of hours</Text>

          <View style={styles.row}>
            <TextInput
              value={hoursText}
              onChangeText={setHoursText}
              keyboardType="decimal-pad"
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />

            <Pressable style={styles.addBtn}>
              <Text style={styles.addBtnText}>＋ Add</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activities</Text>

          <View style={{ gap: 12, marginTop: 8 }}>
            {PREVIEW_ITEMS.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.dot} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>
                    {CATEGORIES.find((c) => c.key === item.category)?.label}
                  </Text>
                  <Text style={styles.itemSub}>{item.hours}</Text>
                </View>

                <Pressable style={styles.trashBtn}>
                  <Text style={styles.trash}>🗑️</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={[styles.bottomBtn, styles.resetBtn]}>
          <Text style={styles.resetText}>↻ Reset</Text>
        </Pressable>

        <Pressable style={[styles.bottomBtn, styles.saveBtn]}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 18, paddingBottom: 120 },

  backBtn: { width: 44, height: 44, justifyContent: "center" },
  backArrow: { fontSize: 26, fontWeight: "800", color: "#111827" },

  title: { fontSize: 30, fontWeight: "900", marginTop: 8, color: "#111827" },
  total: { fontSize: 18, color: "#6B7280", marginTop: 10, fontWeight: "700" },

  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 18 },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.6,
    color: "#111827",
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6B7280",
    letterSpacing: 0.6,
  },

  pickerOuter: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#22C55E",
    borderRadius: 18,
    padding: 2,
  },
  pickerInner: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  picker: {
    ...(Platform.OS === "ios" ? { height: 44 } : { height: 52 }),
  },

  row: { flexDirection: "row", gap: 12, alignItems: "center", marginTop: 10 },

  input: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  addBtn: {
    height: 54,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  dot: { width: 18, height: 18, borderRadius: 999, backgroundColor: "#16A34A" },
  itemTitle: { fontSize: 18, fontWeight: "900", color: "#111827" },
  itemSub: { marginTop: 6, fontSize: 16, color: "#6B7280", fontWeight: "800" },

  trashBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  trash: { fontSize: 18 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  bottomBtn: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  resetBtn: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" },
  resetText: { fontSize: 18, fontWeight: "900", color: "#111827" },

  deleteBtn: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  deleteText: { fontSize: 18, fontWeight: "900", color: "#FFFFFF" },

  saveBtn: { backgroundColor: "#111827", borderColor: "#111827" },
  saveText: { fontSize: 18, fontWeight: "900", color: "#FFFFFF" },
});