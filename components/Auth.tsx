import React, {useEffect, useState} from "react";
import {
  Alert,
  AppState,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {supabase} from "@/lib/supabase";
import {C} from "@/constants/theme";
import {StyleSheet} from "react-native";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove()
    }
  }, [])

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Fill in all fields")
      return;
    }
    try {
      setSignInLoading(true);
      const {error} = await supabase.auth.signInWithPassword({email, password});

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      else{
        Alert.alert("Something went wrong");
      }
    } finally {
      setSignInLoading(false);
    }
  }

  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert("Fill in all fields")
      return;
    }
    setSignUpLoading(true);
    const {data: {session}, error} = await supabase.auth.signUp({email, password});
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox for email verification!");
    setSignUpLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={C.textTert}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={C.textTert}
              secureTextEntry
              style={styles.input}
            />

            <Pressable style={[styles.primaryButton, signInLoading && styles.disabled]} onPress={signInWithEmail}
                       disabled={signInLoading}>
              {signInLoading ? <ActivityIndicator color={C.card}/> : <Text style={styles.primaryText}>Sign In</Text>}
            </Pressable>

            <Pressable style={[styles.secondaryButton, signUpLoading && styles.disabled]} onPress={signUpWithEmail}
                       disabled={signUpLoading}>
              <Text style={styles.secondaryText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: C.bg,
  },
  inner: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: C.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: C.textSec,
    marginBottom: 30,
  },
  form: {
    width: "100%",
    gap: 14,
  },
  input: {
    height: 60,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: C.divider,
    paddingHorizontal: 18,
    fontSize: 16,
    color: C.text,
    backgroundColor: C.card,
  },
  primaryButton: {
    height: 58,
    borderRadius: 24,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  primaryText: {
    color: C.card,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: C.divider,
    backgroundColor: C.card,
  },
  secondaryText: {
    color: C.accent,
    fontSize: 16,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.6,
  },
});