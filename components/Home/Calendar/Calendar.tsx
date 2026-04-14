import React, { useRef, useState } from "react";
import { Animated, PanResponder, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { MONTHS, WEEKDAYS } from "@/constants/mockData";
import { C } from "@/constants/theme";
import { generateMonth } from "@/utilis/utils";
import { stylesCalendar } from "@/components/Home/Calendar/CalendarStyle";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type CalendarProps = {
  todayDate: Date;
  year: number;
  month: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  activeDates: Set<string>;
};

export function Calendar({todayDate, year, month, setYear, setMonth, activeDates,}: CalendarProps) {
  const todayStr = formatLocalDate(todayDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const navRef = useRef({
    prev: () => {},
    next: () => {},
  });

  function animateChange(fn: () => void) {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      fn();

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  function prevMonth() {
    animateChange(() => {
      setSelectedDate(null);

      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    });
  }

  function nextMonth() {
    animateChange(() => {
      setSelectedDate(null);

      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    });
  }

  navRef.current.prev = prevMonth;
  navRef.current.next = nextMonth;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 15 &&
        Math.abs(gestureState.dy) < Math.abs(gestureState.dx),

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          navRef.current.next();
        } else if (gestureState.dx > 50) {
          navRef.current.prev();
        }
      },
    })
  ).current;

  const monthData = generateMonth(year, month);
  const firstWeekDay = monthData[0]?.weekDay ?? 0;

  const leadingCount = firstWeekDay === 0 ? 6 : firstWeekDay - 1;
  const total = leadingCount + monthData.length;
  const trailingCount = total % 7 === 0 ? 0 : 7 - (total % 7);

  const allCells: (typeof monthData[0] | null)[] = [
    ...Array(leadingCount).fill(null),
    ...monthData,
    ...Array(trailingCount).fill(null),
  ];

  const weeks: (typeof monthData[0] | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  return (
    <View style={stylesCalendar.card} {...panResponder.panHandlers}>
      <View style={stylesCalendar.monthNav}>
        <Pressable onPress={prevMonth} style={stylesCalendar.navBtn}>
          <Ionicons name="chevron-back" size={16} color={C.textSec} />
        </Pressable>

        <Text style={stylesCalendar.monthName}>
          {MONTHS[month]} {year}
        </Text>

        <Pressable onPress={nextMonth} style={stylesCalendar.navBtn}>
          <Ionicons name="chevron-forward" size={16} color={C.textSec} />
        </Pressable>
      </View>

      <View style={stylesCalendar.weekdayRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={stylesCalendar.dayCol}>
            <Text style={stylesCalendar.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={stylesCalendar.weekRow}>
            {week.map((dayItem, dayIndex) => {
              if (!dayItem) {
                return <View key={dayIndex} style={stylesCalendar.dayCol} />;
              }

              const isActive = activeDates.has(dayItem.date);
              const isToday = dayItem.date === todayStr;
              const isSelected = selectedDate === dayItem.date;
              const isFuture = dayItem.date > todayStr;

              return (
                <Pressable
                  key={dayItem.date}
                  disabled={isFuture}
                  style={({ pressed }) => [
                    stylesCalendar.dayCol,
                    pressed && !isFuture && { opacity: 0.6 },
                    isFuture && { opacity: 0.35 },
                  ]}
                  onPress={() => {
                    if (isFuture) return;

                    setSelectedDate(dayItem.date);
                    router.push(`/day/${dayItem.date}`);
                  }}
                >
                  <View
                    style={[
                      stylesCalendar.dayCircle,
                      isActive &&
                      !isSelected &&
                      !isToday &&
                      stylesCalendar.dayCircleActive,
                      isToday &&
                      !isSelected &&
                      stylesCalendar.dayCircleToday,
                      isSelected && stylesCalendar.dayCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        stylesCalendar.dayNum,
                        isActive &&
                        !isSelected &&
                        !isToday &&
                        stylesCalendar.dayNumActive,
                        isToday &&
                        !isSelected &&
                        stylesCalendar.dayNumToday,
                        isSelected && stylesCalendar.dayNumSelected,
                      ]}
                    >
                      {dayItem.day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </Animated.View>

      <View style={stylesCalendar.legend}>
        <View style={stylesCalendar.legendItem}>
          <View
            style={[stylesCalendar.legendDot, { backgroundColor: C.accent }]}
          />
          <Text style={stylesCalendar.legendLabel}>logged day</Text>
        </View>

        <View style={stylesCalendar.legendItem}>
          <View
            style={[
              stylesCalendar.legendDot,
              {
                backgroundColor: "transparent",
                borderWidth: 1.5,
                borderColor: C.blue4,
              },
            ]}
          />
          <Text style={stylesCalendar.legendLabel}>today</Text>
        </View>
      </View>
    </View>
  );
}