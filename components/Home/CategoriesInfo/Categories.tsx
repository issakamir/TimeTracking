import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { stylesCategories } from "@/components/Home/CategoriesInfo/CategoriesStyle";
import { MONTHS } from "@/constants/mockData";

type CategoriesProps = {
  totalHours: number;
  hoursByCategory: Record<string, number>;
  loading: boolean;
  month: number;
};

const CATEGORY_META = [
  { key: "deep", label: "Deep Work", icon: "flash", color: "#7C3AED" },
  { key: "study", label: "Study", icon: "book", color: "#2563EB" },
  { key: "gym", label: "Gym", icon: "barbell", color: "#16A34A" },
  { key: "social", label: "Social", icon: "people", color: "#F59E0B" },
  { key: "rest", label: "Rest", icon: "moon", color: "#6B7280" },
];

export function Categories({totalHours, hoursByCategory, loading, month,}: CategoriesProps) {
  const categories = CATEGORY_META.map((category) => ({
    ...category,
    hours: hoursByCategory[category.key] || 0,
  }));

  return (
    <View style={stylesCategories.card}>
      <View style={stylesCategories.categoriesHeader}>
        <Text style={stylesCategories.categoriesTitle}>Categories</Text>
        <Text style={stylesCategories.categoriesSubtitle}>{MONTHS[month]}</Text>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        categories.map((cat) => {
          const pct =
            totalHours > 0 ? Math.round((cat.hours / totalHours) * 100) : 0;

          return (
            <View key={cat.key} style={stylesCategories.categoryRow}>
              <View
                style={[
                  stylesCategories.categoryIcon,
                  { backgroundColor: cat.color + "18" },
                ]}
              >
                <Ionicons name={cat.icon as any} size={16} color={cat.color} />
              </View>

              <View style={stylesCategories.categoryContent}>
                <View style={stylesCategories.categoryTopRow}>
                  <Text style={stylesCategories.categoryName}>{cat.label}</Text>

                  <View style={stylesCategories.categoryMeta}>
                    <Text style={stylesCategories.categoryPct}>{pct}%</Text>
                    <Text style={stylesCategories.categoryHours}>{cat.hours}h</Text>
                  </View>
                </View>

                <View style={stylesCategories.progressTrack}>
                  <View
                    style={[
                      stylesCategories.progressFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        }
        )
      )}
      {!loading && (
        <>
          <View style={stylesCategories.totalDivider} />

          <View style={stylesCategories.totalRow}>
            <Text style={stylesCategories.totalLabel}>Total</Text>
            <Text style={stylesCategories.totalValue}>{totalHours}h</Text>
          </View>
        </>
      )}
    </View>
  );
}