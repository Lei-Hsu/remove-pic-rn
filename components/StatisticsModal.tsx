import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { formatBytes } from "../utils/fileSize";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface SessionStats {
  photosDeleted: number;
  spaceFreed: number;
}

interface StatisticsModalProps {
  visible: boolean;
  onClose: () => void;
  sessionStats: SessionStats | null;
  totalPhotosDeleted: number;
  totalSpaceFreed: number;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  visible,
  onClose,
  sessionStats,
  totalPhotosDeleted,
  totalSpaceFreed,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!sessionStats) return null;

  const handleViewAllStats = () => {
    onClose();
    // 導航到統計頁面
    router.push("/(tabs)/explore");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          {/* 成功標題 */}
          <View style={styles.header}>
            <ThemedText style={styles.successIcon}>🎉</ThemedText>
            <ThemedText style={styles.title}>
              {t("statistics.success_title")}
            </ThemedText>
          </View>

          {/* 本次會話統計 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("statistics.this_session")}
            </ThemedText>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <ThemedText style={styles.statIcon}>📸</ThemedText>
                <ThemedText style={styles.statValue}>
                  {sessionStats.photosDeleted}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  {t("statistics.photos")}
                </ThemedText>
              </View>
              <View style={styles.statBox}>
                <ThemedText style={styles.statIcon}>💾</ThemedText>
                <ThemedText style={styles.statValue}>
                  {formatBytes(sessionStats.spaceFreed)}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  {t("statistics.storage")}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* 累計統計 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {t("statistics.all_time")}
            </ThemedText>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <ThemedText style={styles.statValue}>
                  {totalPhotosDeleted}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  {t("statistics.total_deleted")}
                </ThemedText>
              </View>
              <View style={styles.statBox}>
                <ThemedText style={styles.statValue}>
                  {formatBytes(totalSpaceFreed)}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  {t("statistics.total_freed")}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* 按鈕 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.viewAllButton]}
              onPress={handleViewAllStats}
            >
              <ThemedText style={styles.viewAllButtonText}>
                {t("statistics.view_all")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.closeButtonText}>
                {t("common.close")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  viewAllButton: {
    backgroundColor: "#007AFF",
  },
  viewAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
