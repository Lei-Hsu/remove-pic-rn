import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { ErrorBoundary } from "react-error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../i18n";
import { ErrorFallback } from "../components/ErrorFallback";
import { initializePurchaseStore } from "../stores/usePurchaseStore";
import { initializeStatisticsStore } from "../stores/useStatisticsStore";

export default function RootLayout() {
  const { t } = useTranslation();

  useEffect(() => {
    let cleanupPurchase: (() => void) | undefined;
    let isMounted = true;

    // 初始化儲存庫
    const initialize = async () => {
      try {
        const [purchaseCleanup] = await Promise.all([
          initializePurchaseStore(),
          initializeStatisticsStore(),
        ]);

        if (isMounted) {
          cleanupPurchase = purchaseCleanup;
        }
      } catch (error) {
        console.error("Failed to initialize stores:", error);

        if (isMounted) {
          Alert.alert(
            t("errors.initialization_failed"),
            t("errors.initialization_failed_message"),
            [
              {
                text: t("common.retry"),
                onPress: () => initialize(),
              },
              {
                text: t("common.close"),
                style: "cancel",
              },
            ]
          );
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (cleanupPurchase) {
        cleanupPurchase();
      }
    };
  }, [t]);

  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    console.error("Error caught by boundary:", error, errorInfo);
    // 可以在這裡加入錯誤追蹤服務 (如 Sentry)
  };

  return (
    <SafeAreaProvider>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={handleError}
        onReset={() => {
          // 重置應用程式狀態 (如果需要)
          console.log("Error boundary reset");
        }}
      >
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
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
