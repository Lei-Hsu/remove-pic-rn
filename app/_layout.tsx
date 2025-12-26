import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DeletionProvider } from "../context/DeletionContext";
import { PurchaseProvider } from "../context/PurchaseContext";
import { StatisticsProvider } from "../context/StatisticsContext";
import "../i18n";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PurchaseProvider>
        <StatisticsProvider>
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
        </StatisticsProvider>
      </PurchaseProvider>
    </SafeAreaProvider>
  );
}
