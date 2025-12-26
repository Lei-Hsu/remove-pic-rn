import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { usePurchaseActions } from "../hooks/usePurchaseActions";
import { usePurchaseStore } from "../stores/usePurchaseStore";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const { purchaseProduct, restorePurchases } = usePurchaseActions();
  const isLoading = usePurchaseStore((state) => state.isLoading);
  const error = usePurchaseStore((state) => state.error);

  const handlePurchase = async () => {
    const success = await purchaseProduct();
    // 如果購買成功，關閉彈窗
    if (success) {
      setTimeout(() => onClose(), 1500);
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    // 如果恢復成功，關閉彈窗
    if (success) {
      setTimeout(() => onClose(), 1500);
    }
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
          {/* 標題區域 */}
          <View style={styles.header}>
            <ThemedText style={styles.icon}>⭐</ThemedText>
            <ThemedText style={styles.title}>{t("premium.title")}</ThemedText>
          </View>

          {/* 功能列表 */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>🚫</ThemedText>
              <ThemedText style={styles.featureText}>
                {t("premium.feature_no_ads")}
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>♾️</ThemedText>
              <ThemedText style={styles.featureText}>
                {t("premium.feature_unlimited")}
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>⚡</ThemedText>
              <ThemedText style={styles.featureText}>
                {t("premium.feature_no_limit")}
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>❤️</ThemedText>
              <ThemedText style={styles.featureText}>
                {t("premium.feature_support")}
              </ThemedText>
            </View>
          </View>

          {/* 價格說明 */}
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceText}>
              {t("premium.price")}
            </ThemedText>
          </View>

          {/* 錯誤訊息 */}
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* 按鈕區域 */}
          <View style={styles.buttonContainer}>
            {/* 購買按鈕 */}
            <TouchableOpacity
              style={[styles.button, styles.purchaseButton]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <ThemedText style={styles.purchaseButtonIcon}>💳</ThemedText>
                  <ThemedText style={styles.purchaseButtonText}>
                    {t("premium.purchase_button")}
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>

            {/* 恢復購買按鈕 */}
            <TouchableOpacity
              style={[styles.button, styles.restoreButton]}
              onPress={handleRestore}
              disabled={isLoading}
            >
              <ThemedText style={styles.restoreButtonText}>
                {t("premium.restore_button")}
              </ThemedText>
            </TouchableOpacity>

            {/* 關閉按鈕 */}
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <ThemedText style={styles.closeButtonText}>
                {t("common.close")}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* 底部說明 */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              {t("premium.footer_note")}
            </ThemedText>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  priceContainer: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9500",
  },
  errorContainer: {
    backgroundColor: "#FFE6E6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  purchaseButton: {
    backgroundColor: "#007AFF",
  },
  purchaseButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  restoreButton: {
    backgroundColor: "#34C759",
  },
  restoreButtonText: {
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
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
