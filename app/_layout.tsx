import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {AuthProvider} from "@/lib/api/AuthProvider";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
     <AuthProvider>
       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
         <Stack>
           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
           <Stack.Screen name="day/[day]" options={{ headerShown: false }} />
         </Stack>
         <StatusBar style="auto" />
       </ThemeProvider>
     </AuthProvider>

  );
}