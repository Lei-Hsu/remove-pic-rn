import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useDeletion } from "../context/DeletionContext";
import { usePhotoLibrary } from "../hooks/usePhotoLibrary";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy";

export default function ConfirmationScreen() {
  const { markedForDeletion, unmarkForDeletion, clearDeletionList } =
    useDeletion();
  const { deletePhotos } = usePhotoLibrary();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = async () => {
    if (markedForDeletion.length === 0) return;

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
              clearDeletionList();
              Alert.alert(
                t("common.success"),
                t("confirmation.success_message"),
                [{ text: t("common.ok"), onPress: () => router.back() }]
              );
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
      <ThemedView style={styles.adContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </ThemedView>
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
