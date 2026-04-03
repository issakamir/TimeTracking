import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  StatusBar, ScrollView,
} from 'react-native';
import { Feather} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {C} from "@/constants/theme";
import {router} from "expo-router";
import {useAuth} from "@/lib/api/AuthProvider";
import {supabase} from "@/lib/supabase";
import {SettingsRow} from "@/components/SettingsRow";

export default function Settings() {
  const {profile}=useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <Image
                source={{}}
                style={styles.avatar}
              />
              <View style={styles.profileTextWrap}>
                <Text style={styles.welcome}>Welcome</Text>
                <Text style={styles.name}>{profile?.username}</Text>
              </View>
            </View>

            <Pressable style={styles.logoutButton}
            onPress={()=>{supabase.auth.signOut()}}>
              <Feather name="log-out" size={23} color="#1B2670" />
            </Pressable>
          </View>

          <View style={styles.topDivider} />

          <View style={styles.list}>
            <SettingsRow
              icon={<Feather name="user" size={22} color="#A6A6AD" />}
              title={"User Profile"}
              onPress={()=>{router.push('/account/account')}}/>

            <View style={styles.divider} />
            <SettingsRow
              icon={ <Feather name="lock" size={22} color="#A6A6AD" />}
              title={"Change Password"}
            onPress={()=>{router.push('/account/password')}}/>
            <View style={styles.divider} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg
  },

  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  title: {
    fontSize: 36,
    lineHeight: 46,
    fontWeight: '800',
    color: '#111B4D',
    letterSpacing: -1.2,
    marginTop: 4,
    marginBottom: 30,
  },

  profileRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },

  profileTextWrap: {
    justifyContent: 'center',
  },

  welcome: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '400',
    color: '#A8A9B3',
    marginBottom: 4,
  },

  name: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: '#131A2E',
    letterSpacing: -0.2,
  },

  logoutButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  topDivider: {
    height: 1,
    backgroundColor: '#E4E7EE',
  },

  list: {
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8EBF1',
  },

  switch: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
  },
});