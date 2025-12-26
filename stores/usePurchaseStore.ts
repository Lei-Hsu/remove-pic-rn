import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";
import * as IAP from "react-native-iap";
import { create } from "zustand";

const PRODUCT_ID = Constants.expoConfig?.extra?.iapProductId || "com.yourapp.premium";
const STORAGE_KEY = "@purchase_state";

interface PurchaseStore {
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  purchaseProduct: (t: any) => Promise<void>;
  restorePurchases: (t: any) => Promise<void>;
  loadPurchaseState: () => Promise<void>;
  savePurchaseState: (premium: boolean) => Promise<void>;
  initIAP: () => Promise<void>;
  checkPendingPurchases: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  isPremium: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  loadPurchaseState: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        set({ isPremium: value === "true" });
      }
    } catch (e) {
      console.error("Failed to load purchase state:", e);
    }
  },

  savePurchaseState: async (premium: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, premium.toString());
      set({ isPremium: premium });
    } catch (e) {
      console.error("Failed to save purchase state:", e);
    }
  },

  checkPendingPurchases: async () => {
    try {
      const availablePurchases = await IAP.getAvailablePurchases();
      if (availablePurchases.length > 0) {
        await get().savePurchaseState(true);
      }
    } catch (err) {
      console.warn("Error checking purchases:", err);
    }
  },

  initIAP: async () => {
    if (Platform.OS !== "ios") {
      set({ isInitialized: true });
      return;
    }

    try {
      await IAP.initConnection();
      await get().checkPendingPurchases();
      set({ isInitialized: true });
    } catch (err) {
      console.warn("IAP initialization failed:", err);
      set({ isInitialized: true });
    }
  },

  purchaseProduct: async (t) => {
    if (Platform.OS !== "ios") {
      Alert.alert(t("purchase.not_available_title"), t("purchase.iap_ios_only"));
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const products = await IAP.fetchProducts({ skus: [PRODUCT_ID] });
      if (products?.length === 0) {
        throw new Error("Product not found. Please configure IAP product in App Store Connect.");
      }

      await IAP.requestPurchase({
        request: { apple: { sku: PRODUCT_ID } },
        type: "in-app",
      });

      await get().savePurchaseState(true);
      Alert.alert(t("purchase.success_title"), t("purchase.purchase_success_message"));
    } catch (error) {
      const err = error as IAP.PurchaseError;
      console.error("Purchase failed:", err);

      let errorMessage: string;
      if (err.code === IAP.ErrorCode.UserCancelled) {
        errorMessage = t("purchase.purchase_cancelled");
      } else if (err.code === IAP.ErrorCode.ItemUnavailable) {
        errorMessage = t("purchase.product_unavailable");
      } else {
        errorMessage = err.message || t("purchase.default_error");
        Alert.alert(t("purchase.purchase_failed_title"), errorMessage);
      }
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  restorePurchases: async (t) => {
    if (Platform.OS !== "ios") {
      Alert.alert(t("purchase.not_available_title"), t("purchase.restore_ios_only"));
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const availablePurchases = await IAP.getAvailablePurchases();

      if (availablePurchases.length > 0) {
        await get().savePurchaseState(true);
        Alert.alert(t("purchase.success_title"), t("purchase.restore_success_message"));
      } else {
        Alert.alert(t("purchase.no_purchases_title"), t("purchase.no_purchases_message"));
      }
    } catch (error) {
      const err = error as IAP.PurchaseError;
      console.error("Restore failed:", err);
      const errorMessage = err.message || t("purchase.restore_failed_title");
      set({ error: errorMessage });
      Alert.alert(t("purchase.restore_failed_title"), t("purchase.restore_failed_message"));
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),
}));

// 初始化函數
export const initializePurchaseStore = async () => {
  const store = usePurchaseStore.getState();
  await store.loadPurchaseState();
  await store.initIAP();

  if (Platform.OS === "ios") {
    return () => {
      IAP.endConnection();
    };
  }
  return () => {};
};
