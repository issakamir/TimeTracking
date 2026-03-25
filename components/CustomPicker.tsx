import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = {
  label: string;
  value: string;
};

type Props = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: Option[];
};

export default function CustomPicker({
                                       selectedValue,
                                       onValueChange,
                                       options,
                                     }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || "Select category";

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.field} onPress={() => setOpen(!open)}>
        <Text
          style={[
            styles.fieldText,
            !selectedValue && styles.placeholderText,
          ]}
        >
          {selectedLabel}
        </Text>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#7B8DB0"
        />
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {options.map((item) => {
            const isSelected = item.value === selectedValue;

            return (
              <Pressable
                key={item.value}
                style={[styles.option, isSelected && styles.optionActive]}
                onPress={() => {
                  onValueChange(item.value);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextActive,
                  ]}
                >
                  {item.label}
                </Text>

                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color="#2F6CF6"
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },

  field: {
    height: 58,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: "#DCE3F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#17203A",
  },

  placeholderText: {
    color: "#A5AEC4",
    fontWeight: "500",
  },

  dropdown: {
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F3",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    overflow: "hidden",
  },

  option: {
    height: 54,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionActive: {
    backgroundColor: "#F4F7FF",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C274C",
  },

  optionTextActive: {
    color: "#2F6CF6",
    fontWeight: "700",
  },
});