import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/lib/supabase";
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [nonce, setNonce] = useState("");

  const sendCode = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Fill in both password fields");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords dont match");
      return;
    }

    setSendingCode(true);

    try {
      const { error } = await supabase.auth.reauthenticate();
      if (error) {
        throw error;
      }
      setCodeSent(true);
      Alert.alert("Code sent", "Check your email for the verification code");
    } catch (error: any) {
      Alert.alert("Error occured", error?.message ?? "Failed to send verification code");
    } finally {
      setSendingCode(false);
    }
  };

  const updatePassword = async () => {
    if (!codeSent) {
      Alert.alert("Send the verification code first");
      return;
    }

    if (!nonce.trim()) {
      Alert.alert("Enter the verification code ");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Password must be at least 8 characters");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords dont match");
      return;
    }

    try {
      setUpdating(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        nonce: nonce.trim(),
      });

      if (error) {
        throw error;
      }

      Alert.alert("Passwords updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setNonce("");
      setCodeSent(false);
    } catch (error: any) {
      Alert.alert("Error occured", error?.message ?? "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

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

          <Text style={styles.headerTitle}>Change Password</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <Text style={styles.label}>New Password</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          placeholderTextColor="#A1A1AA"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor="#A1A1AA"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryButton, sendingCode && styles.buttonDisabled]}
          onPress={sendCode}
          disabled={sendingCode}
        >
          {sendingCode ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {codeSent ? "Code Sent" : "Send Verification Code"}
            </Text>
          )}
        </Pressable>

        <View style={styles.codeCard}>
          <Text style={styles.codeTitle}>Verification Code</Text>
          <Text style={styles.codeHint}>
            Paste the code you received by email.
          </Text>

          <TextInput
            value={nonce}
            onChangeText={setNonce}
            placeholder="Enter code"
            placeholderTextColor="#A1A1AA"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <Pressable
          style={[styles.saveButton, updating && styles.buttonDisabled]}
          onPress={updatePassword}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE NEW PASSWORD</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
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
    marginBottom: 24,
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

  headerPlaceholder: {
    width: 36,
    height: 36,
  },

  heroCard: {
    backgroundColor: "#20297A",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 28,
  },

  heroLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#AEB7F0",
    marginBottom: 10,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
    marginBottom: 8,
  },

  heroText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#D9DDF7",
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
    marginBottom: 18,
  },

  primaryButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#20297A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 22,
    shadowColor: "#20297A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  codeCard: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 4,
    marginBottom: 22,
  },

  codeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  codeHint: {
    fontSize: 14,
    lineHeight: 20,
    color: "#8C8FA1",
    marginBottom: 16,
  },

  saveButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#20297A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#20297A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  buttonDisabled: {
    opacity: 0.65,
  },
});