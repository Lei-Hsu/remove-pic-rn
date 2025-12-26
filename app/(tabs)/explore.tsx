import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { StatsCard } from "../../components/StatsCard";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import {
  DeletionSession,
  useStatistics,
} from "../../context/StatisticsContext";
import { formatBytes } from "../../utils/fileSize";

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const {
    sessions,
    totalPhotosDeleted,
    totalSpaceFreed,
    clearHistory,
    isLoading,
  } = useStatistics();

  const handleClearHistory = () => {
    Alert.alert(
      t("statistics.clear_history_title"),
      t("statistics.clear_history_message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete_action"),
          style: "destructive",
          onPress: clearHistory,
        },
      ]
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderSessionItem = ({ item }: { item: DeletionSession }) => (
    <ThemedView style={styles.sessionItem}>
      <View style={styles.sessionHeader}>
        <ThemedText style={styles.sessionDate}>
          {formatDate(item.date)}
        </ThemedText>
      </View>
      <View style={styles.sessionStats}>
        <View style={styles.sessionStat}>
          <ThemedText style={styles.sessionStatIcon}>📸</ThemedText>
          <ThemedText style={styles.sessionStatValue}>
            {item.photosDeleted}
          </ThemedText>
          <ThemedText style={styles.sessionStatLabel}>
            {t("statistics.photos")}
          </ThemedText>
        </View>
        <View style={styles.sessionStat}>
          <ThemedText style={styles.sessionStatIcon}>💾</ThemedText>
          <ThemedText style={styles.sessionStatValue}>
            {formatBytes(item.spaceFreed)}
          </ThemedText>
          <ThemedText style={styles.sessionStatLabel}>
            {t("statistics.freed")}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{t("common.loading")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 標題 */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t("statistics.title")}
          </ThemedText>
        </ThemedView>

        {/* 總覽卡片 */}
        <ThemedView style={styles.summarySection}>
          <StatsCard
            icon="📸"
            title={t("statistics.total_deleted")}
            value={totalPhotosDeleted.toString()}
            color="#007AFF"
          />
          <StatsCard
            icon="💾"
            title={t("statistics.space_freed")}
            value={formatBytes(totalSpaceFreed)}
            color="#34C759"
          />
          <StatsCard
            icon="📊"
            title={t("statistics.sessions")}
            value={sessions.length.toString()}
            color="#FF9500"
          />
        </ThemedView>

        {/* 會話歷史 */}
        <ThemedView style={styles.historySection}>
          <View style={styles.historyHeader}>
            <ThemedText type="subtitle" style={styles.historyTitle}>
              {t("statistics.session_history")}
            </ThemedText>
            {sessions.length > 0 && (
              <TouchableOpacity onPress={handleClearHistory}>
                <ThemedText style={styles.clearButton}>
                  {t("statistics.clear_history")}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {sessions.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyIcon}>📭</ThemedText>
              <ThemedText style={styles.emptyText}>
                {t("statistics.no_history")}
              </ThemedText>
            </ThemedView>
          ) : (
            <FlatList
              data={sessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.sessionList}
            />
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
  },
  historySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  clearButton: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "600",
  },
  sessionList: {
    gap: 12,
  },
  sessionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 14,
    color: "#666",
  },
  sessionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sessionStat: {
    alignItems: "center",
    flex: 1,
  },
  sessionStatIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  sessionStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  sessionStatLabel: {
    fontSize: 12,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
