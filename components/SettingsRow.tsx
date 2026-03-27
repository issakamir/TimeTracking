import {Pressable, Text, View, StyleSheet} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React from "react";

type SettingsProps={
  icon:React.ReactNode,
  title:string,
  onPress?: () => void ,
}


export function SettingsRow({icon, title, onPress}: SettingsProps) {
  return(
    <Pressable style={settingsStyles.row}
               onPress={onPress}>
      <View style={settingsStyles.rowLeft}>
        <View style={settingsStyles.iconWrap}>
          {icon}
        </View>
        <Text style={settingsStyles.rowText}>{title}</Text>
      </View>
      <AntDesign name="right" size={18} color="#1B2670" />
    </Pressable>
    )

}


const settingsStyles=StyleSheet.create({
  row: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  iconWrap: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },

  rowText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '500',
    color: '#161C2D',
    letterSpacing: -0.2,
  },
})