import * as MediaLibrary from "expo-media-library";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

export const usePhotoLibrary = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { t } = useTranslation();

  const requestAccess = useCallback(async () => {
    try {
      // Check logical flow for permissions
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
    async (first = 50) => {
      const hasAccess = await requestAccess();
      if (!hasAccess) return;

      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: first,
        sortBy: ["creationTime"],
      });
      setPhotos(assets);
      setHasLoaded(true);
    },
    [requestAccess]
  );

  const deletePhotos = async (assetsToDelete: MediaLibrary.Asset[]) => {
    try {
      await MediaLibrary.deleteAssetsAsync(assetsToDelete);
      // Optimistic update
      setPhotos((current) =>
        current.filter((p) => !assetsToDelete.find((d) => d.id === p.id))
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
    deletePhotos,
    hasLoaded,
  };
};
