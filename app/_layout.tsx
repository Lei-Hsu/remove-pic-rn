import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DeletionProvider } from "../context/DeletionContext";
import "../i18n";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DeletionProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#fff" },
            headerTintColor: "#000",
            headerTitleStyle: { fontWeight: "bold" },
            contentStyle: { backgroundColor: "#fff" },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: "Photo Cleaner", headerShown: false }}
          />
          <Stack.Screen
            name="confirmation"
            options={{
              title: "Review & Delete",
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>
      </DeletionProvider>
    </SafeAreaProvider>
  );
}
