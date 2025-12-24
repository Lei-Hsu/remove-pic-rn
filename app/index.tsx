import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
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
import { DeletionSwiper } from "../components/DeletionSwiper";
import { useDeletion } from "../context/DeletionContext";
import { usePhotoLibrary } from "../hooks/usePhotoLibrary";

// Use TestIds.BANNER for development
const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy";

export default function HomeScreen() {
  const { loadPhotos, photos, hasLoaded } = usePhotoLibrary();
  const { markForDeletion, markedForDeletion } = useDeletion();
  const router = useRouter();

  useEffect(() => {
    loadPhotos(50); // Load initial batch
  }, []);

  const handleSwipeLeft = (index: number) => {
    if (photos[index]) {
      markForDeletion(photos[index]);
    }
  };

  const handleSwipeRight = (index: number) => {
    // Keep - do nothing
  };

  const handleSwipedAll = () => {
    // Logic for when all cards are swiped
    // For now, maybe navigate to confirmation if there are deletions?
    // or load more? Simple version: just stay or show button.
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clean Gallery</Text>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => router.push("/confirmation")}
        >
          <Text style={styles.reviewButtonText}>
            Review ({markedForDeletion.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!hasLoaded ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <DeletionSwiper
            photos={photos}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipedAll={handleSwipedAll}
          />
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    zIndex: 1, // Swiper logic
    position: "relative",
  },
  adContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
    backgroundColor: "#fff",
  },
});
