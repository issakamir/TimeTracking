import {Text, View} from "react-native";
import {CATEGORIES} from "@/constants/mockData";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {stylesCategories} from "@/components/Home/CategoriesInfo/CategoriesStyle";

export function Categories(){

  const totalHours = CATEGORIES.reduce((acc, c) => acc + c.hours, 0);
  return (
    <View style={stylesCategories.card}>
      <View style={stylesCategories.categoriesHeader}>
        <Text style={stylesCategories.categoriesTitle}>Categories</Text>
        <Text style={stylesCategories.categoriesSubtitle}>This Month</Text>
      </View>

      {CATEGORIES.map((cat) => {
        const pct = Math.round((cat.hours / totalHours) * 100);
        return (
          <View key={cat.label} style={stylesCategories.categoryRow}>
            <View style={[stylesCategories.categoryIcon, { backgroundColor: cat.color + "18" }]}>
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
                <View style={[stylesCategories.progressFill, { width: `${pct}%` as any, backgroundColor: cat.color }]} />
              </View>
            </View>
          </View>
        );
      })}

      <View style={stylesCategories.totalDivider} />
      <View style={stylesCategories.totalRow}>
        <Text style={stylesCategories.totalLabel}>Total</Text>
        <Text style={stylesCategories.totalValue}>{totalHours}h</Text>
      </View>
    </View>
  )
}
