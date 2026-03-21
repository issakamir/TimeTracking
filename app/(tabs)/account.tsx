import {useState, useEffect, useCallback} from "react";
import { supabase } from "@/lib/supabase";
import {StyleSheet, View, Alert, Text, TextInput, Pressable, ActivityIndicator,} from "react-native";
import {useAuth} from "@/lib/api/AuthProvider";

export default function Account() {
  const {session, loading:authLoading}=useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const getProfile=useCallback(async ()=>{
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, website, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username ?? "");
        setWebsite(data.website ?? "");
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
        website,
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


  if(authLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={session?.user?.email}
        editable={false}
        style={[styles.input, styles.disabledInput]}
      />

      <Text style={[styles.label, { marginTop: 12 }]}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={[styles.label, { marginTop: 12 }]}>Website</Text>
      <TextInput
        value={website}
        onChangeText={setWebsite}
        style={styles.input}
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={updateProfile}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Update"}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.signOutButton, loading && styles.buttonDisabled]}
        onPress={() => supabase.auth.signOut()}
        disabled={loading}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 16,
    color: "#111827",
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  button: {
    marginTop: 20,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  signOutButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "900",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});