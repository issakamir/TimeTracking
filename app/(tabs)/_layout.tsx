import { Tabs } from 'expo-router';
import React from 'react';
import {Image} from 'react-native';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon:() => (
            <Image
              source={require('@/assets/icons/homeIcon.png')}
              style={{width:24, height:24}}
            />
          )
        }}
      />
      <Tabs.Screen
      name="settings"
      options={{
        title: 'Settings',
        tabBarIcon:() => (
          <Image
          source={require('@/assets/icons/settingsIcon.png')}
          style={{width:24, height:24}}/>
        )
      }}/>
    </Tabs>

  );
}
