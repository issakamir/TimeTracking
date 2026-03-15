import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Option = {
  label: string;
  value: string;
};

type Props = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: Option[];
};

export default function CustomPicker({selectedValue, onValueChange, options,}: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || "Select";

  return (
    <View>
      <Pressable
        style={styles.field}
        onPress={() => setOpen((prev) => !prev)}
      >
        <Text style={styles.fieldText}>{selectedLabel}</Text>
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {options.map((item) => (
            <Pressable
              key={item.value}
              style={styles.option}
              onPress={() => {
                onValueChange(item.value);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#59B863",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  arrow: {
    fontSize: 14,
  },
  dropdown: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});