import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { StatisticsModal } from "../components/StatisticsModal";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { usePhotoLibrary } from "../hooks/usePhotoLibrary";
import { useDeletionStore } from "../stores/useDeletionStore";
import { usePurchaseStore } from "../stores/usePurchaseStore";
import { useStatisticsStore } from "../stores/useStatisticsStore";
import { calculateAssetsSize } from "../utils/fileSize";

// 從環境變數載入橫幅廣告單元 ID
const getAdUnitId = () => {
  if (__DEV__) {
    return TestIds.BANNER;
  }

  if (Platform.OS === "ios") {
    return Constants.expoConfig?.extra?.admobIosBannerId || "";
  }

  // Android 支援暫緩
  return "";
};

const adUnitId = getAdUnitId();

export default function ConfirmationScreen() {
  const { markedForDeletion, unmarkForDeletion, clearDeletionList } =
    useDeletionStore();
  const { deletePhotos } = usePhotoLibrary();
  const isPremium = usePurchaseStore((state) => state.isPremium);
  const addSession = useStatisticsStore((state) => state.addSession);
  const totalPhotosDeleted = useStatisticsStore((state) => state.totalPhotosDeleted());
  const totalSpaceFreed = useStatisticsStore((state) => state.totalSpaceFreed());
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [lastSessionStats, setLastSessionStats] = useState<{
    photosDeleted: number;
    spaceFreed: number;
  } | null>(null);
  const { t } = useTranslation();

  const handleConfirm = async () => {
    if (markedForDeletion.length === 0) return;

    // 先計算檔案大小（在刪除之前）
    console.log("[Confirmation] Calculating file sizes...");
    const totalSize = await calculateAssetsSize(markedForDeletion);
    console.log(`[Confirmation] Total size to delete: ${totalSize} bytes`);

    Alert.alert(
      t("confirmation.alert.title"),
      t("confirmation.alert.message", { count: markedForDeletion.length }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete_action"),
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            const success = await deletePhotos(markedForDeletion);
            setIsDeleting(false);

            if (success) {
              // 儲存統計資料
              await addSession(markedForDeletion.length, totalSize);

              // 設定彈窗資料
              setLastSessionStats({
                photosDeleted: markedForDeletion.length,
                spaceFreed: totalSize,
              });

              // 清除刪除列表
              clearDeletionList();

              // 顯示統計彈窗
              setShowStatsModal(true);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.item}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <ThemedView style={styles.info}>
        <ThemedText style={styles.date}>
          {new Date(item.creationTime).toLocaleDateString()}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity
        onPress={() => unmarkForDeletion(item.id)}
        style={styles.removeButton}
      >
        <ThemedText style={styles.removeText}>{t("common.keep")}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backText}>{t("common.back")}</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          {t("confirmation.title")}
        </ThemedText>
        <ThemedView style={{ width: 50 }} />
      </ThemedView>

      <ThemedView style={styles.content}>
        {markedForDeletion.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {t("confirmation.no_photos")}
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={markedForDeletion}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.summaryText}>
          {t("confirmation.selected_count", {
            count: markedForDeletion.length,
          })}
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            markedForDeletion.length === 0 && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={markedForDeletion.length === 0 || isDeleting}
        >
          <ThemedText style={styles.confirmButtonText}>
            {isDeleting
              ? t("confirmation.deleting_button")
              : t("confirmation.delete_button")}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      {/* 僅為非高級用戶顯示橫幅廣告 */}
      {!isPremium && (
        <ThemedView style={styles.adContainer}>
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </ThemedView>
      )}

      {/* 統計彈窗 */}
      <StatisticsModal
        visible={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          router.back();
        }}
        sessionStats={lastSessionStats}
        totalPhotosDeleted={totalPhotosDeleted}
        totalSpaceFreed={totalSpaceFreed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  removeButton: {
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 5,
  },
  removeText: {
    color: "green",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  summaryText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ffbaba",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  adContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
    backgroundColor: "#fff",
  },
});
