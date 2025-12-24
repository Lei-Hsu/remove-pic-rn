import { Asset } from "expo-media-library";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface DeletionSwiperProps {
  photos: Asset[];
  onSwipeLeft: (cardIndex: number) => void; // Delete
  onSwipeRight: (cardIndex: number) => void; // Keep
  onSwipedAll: () => void;
}

export const DeletionSwiper: React.FC<DeletionSwiperProps> = ({
  photos,
  onSwipeLeft,
  onSwipeRight,
  onSwipedAll,
}) => {
  if (!photos || photos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No photos to show</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={photos}
        renderCard={(card) => {
          // Check if card is null/undefined just in case
          if (!card) return <View style={styles.card} />;

          return (
            <View style={styles.card}>
              <Image
                source={{ uri: card.uri }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.date}>
                {new Date(card.creationTime).toLocaleDateString()}
              </Text>
            </View>
          );
        }}
        onSwipedLeft={onSwipeLeft}
        onSwipedRight={onSwipeRight}
        onSwipedAll={onSwipedAll}
        cardIndex={0}
        backgroundColor={"transparent"}
        stackSize={3}
        cardVerticalMargin={20}
        overlayLabels={{
          left: {
            title: "DELETE",
            style: {
              label: {
                backgroundColor: "red",
                borderColor: "red",
                color: "white",
                borderWidth: 1,
              },
              wrapper: {
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                marginTop: 30,
                marginLeft: -30,
              },
            },
          },
          right: {
            title: "KEEP",
            style: {
              label: {
                backgroundColor: "green",
                borderColor: "green",
                color: "white",
                borderWidth: 1,
              },
              wrapper: {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginTop: 30,
                marginLeft: 30,
              },
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40, // Adjust for swiper default margins
  },
  card: {
    flex: 0.8, // Take up most of the screen
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 0,
    height: "80%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  text: {
    fontSize: 18,
    color: "#888",
  },
  date: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    overflow: "hidden",
  },
});
