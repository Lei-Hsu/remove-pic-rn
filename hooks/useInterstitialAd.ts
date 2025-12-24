import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

/**
 * 用於管理插頁式廣告加載和顯示的 Hook
 *
 * @param isPremium - 如果為真，將不會加載或顯示廣告
 * @returns showAd 函數，用於顯示廣告並返回 Promise
 */
export const useInterstitialAd = (isPremium: boolean) => {
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);

  // 從環境變量加載廣告單元 ID
  // 開發中使用測試 ID，生產中使用 .env 中的真實 ID
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.OS === "ios"
    ? Constants.expoConfig?.extra?.admobIosInterstitialId || ""
    : ""; // Android 支援暫緩

  useEffect(() => {
    // 高級用戶不需要廣告
    if (isPremium) {
      console.log("[InterstitialAd] Premium user - skipping ad load");
      return;
    }

    // 目前僅支援 iOS
    if (Platform.OS !== "ios") {
      console.log("[InterstitialAd] Only iOS supported for now");
      return;
    }

    // 如果未配置廣告單元 ID 則不加載
    if (!adUnitId) {
      console.warn(
        "[InterstitialAd] No ad unit ID configured - check .env file"
      );
      return;
    }

    // 創建插頁式廣告實例
    const ad = InterstitialAd.createForAdRequest(adUnitId);
    setInterstitial(ad);

    // 設置事件監聽器
    const loadedListener = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsAdLoaded(true);
      setIsAdLoading(false);
    });

    const errorListener = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      setIsAdLoaded(false);
      setIsAdLoading(false);
    });

    const closedListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsAdLoaded(false);
      // 自動重新加載廣告以備下次使用
      setIsAdLoading(true);
      ad.load();
    });

    // 開始加載廣告
    setIsAdLoading(true);
    ad.load();

    // 組件卸載時清理
    return () => {
      loadedListener();
      errorListener();
      closedListener();
    };
  }, [isPremium, adUnitId]);

  /**
   * 顯示插頁式廣告
   * 返回一個 Promise，當廣告關閉或無法顯示時解析
   */
  const showAd = async (): Promise<void> => {
    // 高級用戶跳過廣告
    if (isPremium) {
      return Promise.resolve();
    }

    // 如果廣告尚未準備好，稍等或跳過
    if (!isAdLoaded || !interstitial) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      // 監聽廣告關閉事件
      const closeListener = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          closeListener(); // Remove listener
          resolve();
        }
      );

      // 顯示廣告
      interstitial.show().catch((error) => {
        closeListener(); // 移除監聽器
        resolve(); // 無論如何繼續
      });
    });
  };

  return {
    showAd,
    isAdLoaded,
    isAdLoading,
  };
};
