import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
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
      t("confirm_title"),
      t("confirm_message", { count: markedForDeletion.length }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete_action"),
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            const success = await deletePhotos(markedForDeletion);
            setIsDeleting(false);
            if (success) {
              clearDeletionList();
              Alert.alert(t("success"), t("success_message"), [
                { text: t("ok"), onPress: () => router.back() },
              ]);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.date}>
          {new Date(item.creationTime).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => unmarkForDeletion(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>{t("keep")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{t("back")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("review_deletions")}</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {markedForDeletion.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("no_photos_marked")}</Text>
          </View>
        ) : (
          <FlatList
            data={markedForDeletion}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.summaryText}>
          {t("photos_selected", { count: markedForDeletion.length })}
        </Text>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            markedForDeletion.length === 0 && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={markedForDeletion.length === 0 || isDeleting}
        >
          <Text style={styles.confirmButtonText}>
            {isDeleting ? t("deleting") : t("confirm_delete")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.adContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
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
