import * as MediaLibrary from "expo-media-library";
import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";

export const usePhotoLibrary = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const requestAccess = useCallback(async () => {
    try {
      // Check logical flow for permissions
      if (permissionResponse?.status === "granted") return true;

      const { status, canAskAgain } = await requestPermission();
      if (status === "granted") return true;

      if (!canAskAgain) {
        Alert.alert(
          "Permission Required",
          "Please enable photo access in settings to use this app.",
          [
            { text: "Open Settings", onPress: Linking.openSettings },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [permissionResponse, requestPermission]);

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
      Alert.alert("Delete Failed", "Could not delete photos.");
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
