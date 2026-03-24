import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SafeAreaView} from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "@/lib/api/AuthProvider";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import {C} from "@/constants/theme";

export default function Account() {
  const { session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session) getProfile();
  }, [session, getProfile]);

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session.user.id,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      Alert.alert("Profile updated!");
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const avatarSource =
    avatarUrl?.trim()
      ? { uri: avatarUrl }
      : {  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={26} color="#20297A" />
          </Pressable>

          <Text style={styles.headerTitle}>User Profile</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarOuter}>
            <Image source={avatarSource} style={styles.avatar} />
          </View>

          <Pressable style={styles.cameraBadge}>
            <Ionicons name="camera-outline" size={18} color="#20297A" />
          </Pressable>
        </View>

        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          value={session?.user?.email ?? ""}
          editable={false}
          style={[styles.input, styles.disabledInput]}
          placeholderTextColor="#A1A1AA"
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#A1A1AA"
        />

        {/* Save */}
        <Pressable
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={updateProfile}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Loading..." : "SAVE"}
          </Text>
        </Pressable>

        {/* Sign out */}
        <Pressable
          style={[styles.signOutButton, loading && styles.buttonDisabled]}
          onPress={() => supabase.auth.signOut()}
          disabled={loading}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
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
    backgroundColor: C.bg
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
  },

  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },

  headerRightPlaceholder: {
    width: 36,
    height: 36,
  },

  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 34,
    position: "relative",
  },

  avatarOuter: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68,
  },

  cameraBadge: {
    position: "absolute",
    right: 98,
    bottom: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9DCE5",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A3A3A3",
    marginBottom: 10,
    marginLeft: 4,
  },

  input: {
    height: 70,
    borderWidth: 1.2,
    borderColor: "#D8D8D8",
    borderRadius: 35,
    paddingHorizontal: 24,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F5F6FA",
    marginBottom: 20,
  },

  disabledInput: {
    color: "#111827",
  },

  saveButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#20297A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    shadowColor: "#20297A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },

  signOutButton: {
    marginTop: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  signOutText: {
    color: "#D14343",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.65,
  },
});