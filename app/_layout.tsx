import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../i18n";
import { initializePurchaseStore } from "../stores/usePurchaseStore";
import { initializeStatisticsStore } from "../stores/useStatisticsStore";

export default function RootLayout() {
  useEffect(() => {
    let cleanupPurchase: (() => void) | undefined;

    // 初始化儲存庫
    const initialize = async () => {
      const [purchaseCleanup] = await Promise.all([
        initializePurchaseStore(),
        initializeStatisticsStore(),
      ]);
      cleanupPurchase = purchaseCleanup;
    };

    initialize();

    return () => {
      if (cleanupPurchase) {
        cleanupPurchase();
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
