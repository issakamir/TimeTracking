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
              source={require('@/assets/icons/home-button.png')}
              style={{width:24, height:24}}
            />
          )
        }}
      />
      <Tabs.Screen
      name="account"
      options={{
        title: 'Profile',
        tabBarIcon:() => (
          <Image
            source={require('@/assets/icons/user.png')}
            style={{width:24, height:24}}
          />
        )
      }}/>
    </Tabs>

  );
}
