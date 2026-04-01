import {Animated, Pressable, Text, View, PanResponder} from "react-native";
import {MONTHS, WEEKDAYS} from "@/constants/mockData";
import {router, useFocusEffect} from "expo-router";
import React, {useCallback, useRef, useState} from "react";
import {C} from "@/constants/theme";
import {generateMonth} from "@/utilis/utils";
import {Ionicons} from "@expo/vector-icons";
import {stylesCalendar} from "@/components/Home/Calendar/CalendarStyle"
import {supabase} from "@/lib/supabase";


function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function Calendar(){
  const today    = new Date();
  const todayStr = formatLocalDate(today);
  const [year, setYear]                 = useState(today.getFullYear());
  const [month, setMonth]               = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [activeDate, setActiveDate]=useState<Set<string>>(new Set());

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navRef   = useRef({ prev: () => {}, next: () => {} });

    const loadDate=async ()=>{
      try{
      const {data, error}= await supabase
        .from("activities")
        .select("date")

      if(error) throw error;

      const dataSet=new Set(data.map((item)=>item.date));
      setActiveDate(dataSet);
    }
    catch(e){
      console.error(e);
      }
    }

    useFocusEffect(
      useCallback(()=>{
        loadDate();
      }, [])
    )


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

  return (
    <>
      <View style={stylesCalendar.card} {...panResponder.panHandlers}>
        <View style={stylesCalendar.monthNav}>
          <Pressable onPress={prevMonth} style={stylesCalendar.navBtn}>
            <Ionicons name="chevron-back" size={16} color={C.textSec} />
          </Pressable>
          <Text style={stylesCalendar.monthName}>{MONTHS[month]} {year}</Text>
          <Pressable onPress={nextMonth} style={stylesCalendar.navBtn}>
            <Ionicons name="chevron-forward" size={16} color={C.textSec} />
          </Pressable>
        </View>

        <View style={stylesCalendar.weekdayRow}>
          {WEEKDAYS.map((d, i) => (
            <View key={i} style={stylesCalendar.dayCol}>
              <Text style={stylesCalendar.weekdayText}>{d}</Text>
            </View>
          ))}
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {weeks.map((week, wi) => (
            <View key={wi} style={stylesCalendar.weekRow}>
              {week.map((d, di) => {
                if (!d) return <View key={di} style={stylesCalendar.dayCol} />;

                const isActive   = activeDate.has(d.date);
                const isToday    = d.date === todayStr;
                const isSelected = selectedDate === d.date;
                const isFuture = d.date > todayStr;

                return (
                  <Pressable
                    key={d.date}
                    disabled={isFuture}
                    style={({ pressed }) => [
                      stylesCalendar.dayCol,
                      pressed && !isFuture && { opacity: 0.6 },
                      isFuture && { opacity: 0.35 },
                    ]}
                    onPress={() => {
                      if (isFuture) return;
                      router.push(`/day/${d.date}`);
                    }}
                  >
                    <View style={[
                      stylesCalendar.dayCircle,
                      isActive && !isSelected && !isToday && stylesCalendar.dayCircleActive,
                      isToday  && !isSelected             && stylesCalendar.dayCircleToday,
                      isSelected                          && stylesCalendar.dayCircleSelected,
                    ]}>
                      <Text style={[
                        stylesCalendar.dayNum,
                        isActive && !isSelected && !isToday && stylesCalendar.dayNumActive,
                        isToday  && !isSelected            && stylesCalendar.dayNumToday,
                        isSelected                         && stylesCalendar.dayNumSelected,
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

        <View style={stylesCalendar.legend}>
          <View style={stylesCalendar.legendItem}>
            <View style={[stylesCalendar.legendDot, { backgroundColor: C.accent }]} />
            <Text style={stylesCalendar.legendLabel}>logged day</Text>
          </View>
          <View style={stylesCalendar.legendItem}>
            <View style={[stylesCalendar.legendDot, { backgroundColor: "transparent", borderWidth: 1.5, borderColor: C.blue4 }]} />
            <Text style={stylesCalendar.legendLabel}>today</Text>
          </View>
        </View>
      </View>
    </>
  )
}

