import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform } from "react-native";
import * as IAP from "react-native-iap";

// 從環境變量加載產品 ID
const PRODUCT_ID =
  Constants.expoConfig?.extra?.iapProductId || "com.yourapp.premium";
const STORAGE_KEY = "@purchase_state";

interface PurchaseContextType {
  isPremium: boolean;
  isLoading: boolean;
  purchaseProduct: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  error: string | null;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined
);

export const PurchaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // 從 AsyncStorage 加載購買狀態
  const loadPurchaseState = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setIsPremium(value === "true");
      }
    } catch (e) {
      console.error("Failed to load purchase state:", e);
    }
  };

  // 將購買狀態保存到 AsyncStorage
  const savePurchaseState = async (premium: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, premium.toString());
      setIsPremium(premium);
    } catch (e) {
      console.error("Failed to save purchase state:", e);
    }
  };

  // 初始化 IAP 連接（目前僅限 iOS）
  const initIAP = async () => {
    if (Platform.OS !== "ios") {
      return;
    }

    try {
      await IAP.initConnection();
      // 檢查待處理的購買
      await checkPendingPurchases();
    } catch (err) {
      console.warn("IAP initialization failed:", err);
    }
  };

  // 檢查任何待處理的購買
  const checkPendingPurchases = async () => {
    try {
      const availablePurchases = await IAP.getAvailablePurchases();
      if (availablePurchases.length > 0) {
        // 用戶已購買進階版
        await savePurchaseState(true);
      }
    } catch (err) {
      console.warn("Error checking purchases:", err);
    }
  };

  // 購買產品
  const purchaseProduct = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert(
        t("purchase.not_available_title"),
        t("purchase.iap_ios_only")
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: 驗證 App Store Connect 中配置的 PRODUCT_ID
      // 目前開發階段將會優雅地失敗
      const products = await IAP.fetchProducts({ skus: [PRODUCT_ID] });
      if (products?.length === 0) {
        throw new Error(
          "Product not found. Please configure IAP product in App Store Connect."
        );
      }

      await IAP.requestPurchase({
        request: {
          apple: {
            sku: PRODUCT_ID,
          },
        },
        type: 'in-app',
      });

      // Purchase successful
      await savePurchaseState(true);
      Alert.alert(
        t("purchase.success_title"),
        t("purchase.purchase_success_message")
      );
    } catch (error) {
      const err = error as IAP.PurchaseError;
      console.error("Purchase failed:", err);

      if (err.code === IAP.ErrorCode.UserCancelled) {
        setError(t("purchase.purchase_cancelled"));
      } else if (err.code === IAP.ErrorCode.ItemUnavailable) {
        setError(t("purchase.product_unavailable"));
      } else {
        setError(err.message || t("purchase.default_error"));
        Alert.alert(
          t("purchase.purchase_failed_title"),
          err.message || t("purchase.default_error")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 恢復購買
  const restorePurchases = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert(
        t("purchase.not_available_title"),
        t("purchase.restore_ios_only")
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const availablePurchases = await IAP.getAvailablePurchases();

      if (availablePurchases.length > 0) {
        await savePurchaseState(true);
        Alert.alert(
          t("purchase.success_title"),
          t("purchase.restore_success_message")
        );
      } else {
        Alert.alert(
          t("purchase.no_purchases_title"),
          t("purchase.no_purchases_message")
        );
      }
    } catch (error) {
      const err = error as IAP.PurchaseError;
      console.error("Restore failed:", err);
      setError(err.message || t("purchase.restore_failed_title"));
      Alert.alert(
        t("purchase.restore_failed_title"),
        t("purchase.restore_failed_message")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 在組件掛載時初始化
  useEffect(() => {
    loadPurchaseState();

    if (Platform.OS === "ios") {
      initIAP();
    }

    // 組件卸載時清理
    return () => {
      if (Platform.OS === "ios") {
        IAP.endConnection();
      }
    };
  }, []);

  const value: PurchaseContextType = {
    isPremium,
    isLoading,
    purchaseProduct,
    restorePurchases,
    error,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

// 使用 Purchase context 的自定義 hook
export const usePurchase = (): PurchaseContextType => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  return context;
};
