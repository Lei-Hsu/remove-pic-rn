import * as MediaLibrary from "expo-media-library";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

export const usePhotoLibrary = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMorePhotos, setHasMorePhotos] = useState(false);
  const [totalPhotosLoaded, setTotalPhotosLoaded] = useState(0);
  const { t } = useTranslation();

  const requestAccess = useCallback(async () => {
    try {
      // 檢查權限的邏輯流程
      if (permissionResponse?.status === "granted") return true;

      const { status, canAskAgain } = await requestPermission();
      if (status === "granted") return true;

      if (!canAskAgain) {
        Alert.alert(t("permissions.required"), t("permissions.message"), [
          {
            text: t("permissions.open_settings"),
            onPress: Linking.openSettings,
          },
          { text: t("common.cancel"), style: "cancel" },
        ]);
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [permissionResponse, requestPermission, t]);

  const loadPhotos = useCallback(
    async (first = 50, loadMore = false) => {
      const hasAccess = await requestAccess();
      if (!hasAccess) return;

      const result = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: first,
        sortBy: ["creationTime"],
        after: loadMore ? endCursor : undefined,
      });

      if (loadMore) {
        // 追加到現有照片
        setPhotos((current) => [...current, ...result.assets]);
        setTotalPhotosLoaded((current) => current + result.assets.length);
      } else {
        // 初始加載
        setPhotos(result.assets);
        setTotalPhotosLoaded(result.assets.length);
      }

      setEndCursor(result.endCursor);
      setHasMorePhotos(result.hasNextPage);
      setHasLoaded(true);
    },
    [requestAccess, endCursor]
  );

  const loadNextBatch = useCallback(
    async (batchSize = 50) => {
      if (!hasMorePhotos) {
        return;
      }
      await loadPhotos(batchSize, true);
    },
    [hasMorePhotos, loadPhotos]
  );

  const deletePhotos = async (assetsToDelete: MediaLibrary.Asset[]) => {
    try {
      await MediaLibrary.deleteAssetsAsync(assetsToDelete);
      // 樂觀更新
      setPhotos((current) =>
        current.filter(
          (photo) =>
            !assetsToDelete.find((deletedPhoto) => deletedPhoto.id === photo.id)
        )
      );
      return true;
    } catch (error) {
      console.error("Delete failed", error);
      Alert.alert(t("errors.delete_failed"), t("errors.delete_failed_message"));
      return false;
    }
  };

  return {
    permissionResponse,
    requestAccess,
    photos,
    loadPhotos,
    loadNextBatch,
    deletePhotos,
    hasLoaded,
    hasMorePhotos,
    totalPhotosLoaded,
  };
};
