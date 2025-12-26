import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
import { DeletionSwiper } from "../components/DeletionSwiper";
import { PremiumModal } from "../components/PremiumModal";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useInterstitialAd } from "../hooks/useInterstitialAd";
import { usePhotoLibrary } from "../hooks/usePhotoLibrary";
import { useDeletionStore } from "../stores/useDeletionStore";
import { usePurchaseStore } from "../stores/usePurchaseStore";

// 從環境變量加載橫幅廣告單元 ID
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

// 首次載入 50 張圖片
const initialBatchSize = 50;

export default function HomeScreen() {
  const {
    loadPhotos,
    loadNextBatch,
    photos,
    hasLoaded,
    hasMorePhotos,
    totalPhotosLoaded,
  } = usePhotoLibrary();
  const { markForDeletion, markedForDeletion } = useDeletionStore();
  const isPremium = usePurchaseStore((state) => state.isPremium);
  const { showAd } = useInterstitialAd(isPremium);
  const router = useRouter();
  const { t } = useTranslation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    loadPhotos(initialBatchSize); // 加載首批 50 張照片
  }, [loadPhotos]);

  const handleSwipeLeft = (index: number) => {
    if (photos[index]) {
      markForDeletion(photos[index]);
    }
  };

  const handleSwipeRight = (index: number) => {
    // 保留 - 什麼都不做
  };

  const handleSwipedAll = () => {
    // 所有卡片已滑動 - 檢查是否有更多照片
    if (hasMorePhotos) {
      console.log("[HomeScreen] All cards swiped but more photos available");
    } else {
      console.log("[HomeScreen] All photos swiped - no more available");
    }
  };

  // 處理卡片索引變更 - 觸發分頁和廣告
  const handleCardIndexChanged = async (index: number) => {
    setCurrentCardIndex(index);
    console.log(
      `[HomeScreen] Card index changed to: ${index}, Total loaded: ${totalPhotosLoaded}`
    );

    // 每 50 張照片，顯示插頁式廣告並加載下一批
    if (index > 0 && index % 50 === 0 && hasMorePhotos) {
      console.log(`[HomeScreen] Reached 50-photo boundary at index ${index}`);

      // 為非高級用戶顯示廣告
      if (!isPremium) {
        await showAd(); // 等待廣告關閉
      }

      // 加載下一批照片
      await loadNextBatch(50);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerTop}>
          <ThemedText type="title" style={styles.title}>
            {t("home.title")}
          </ThemedText>
          {!isPremium && (
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <ThemedText style={styles.premiumButtonText}>
                ⭐ {t("premium.upgrade")}
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => router.push("/confirmation")}
        >
          <ThemedText style={styles.reviewButtonText}>
            {t("home.review_button", { count: markedForDeletion.length })}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.content}>
        {!hasLoaded ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <DeletionSwiper
            photos={photos}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipedAll={handleSwipedAll}
            currentIndex={currentCardIndex}
            onCardIndexChanged={handleCardIndexChanged}
          />
        )}
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

      {/* 高級版彈窗 */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  premiumButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  premiumButtonText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 14,
  },
  reviewButton: {
    backgroundColor: "#007AFF", // Blue
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: "white",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    zIndex: 1, // Swiper 邏輯
    position: "relative",
  },
  adContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
    backgroundColor: "#fff",
  },
});
