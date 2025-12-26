import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedText } from "./themed-text";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.emoji}>😞</ThemedText>
      <ThemedText style={styles.title}>
        {t("errors.app_error") || "發生錯誤"}
      </ThemedText>
      <ThemedText lightColor="#666" darkColor="#666" style={styles.message}>
        {error?.message || t("errors.unknown_error") || "未知錯誤"}
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={resetErrorBoundary}>
        <ThemedText type="defaultSemiBold" lightColor="#fff" darkColor="#fff">
          {t("common.retry") || "重試"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
});
