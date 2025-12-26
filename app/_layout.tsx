import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../i18n";
import { initializePurchaseStore } from "../stores/usePurchaseStore";
import { initializeStatisticsStore } from "../stores/useStatisticsStore";

export default function RootLayout() {
  const { t } = useTranslation();

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
          options={{ title: t("home.screen_title"), headerShown: false }}
        />
        <Stack.Screen
          name="confirmation"
          options={{
            title: t("confirmation.screen_title"),
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
