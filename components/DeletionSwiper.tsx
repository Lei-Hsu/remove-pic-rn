import { Asset } from "expo-media-library";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet } from "react-native";
import Swiper from "react-native-deck-swiper";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface DeletionSwiperProps {
  photos: Asset[];
  onSwipeLeft: (cardIndex: number) => void; // 刪除
  onSwipeRight: (cardIndex: number) => void; // 保留
  onSwipedAll: () => void;
  currentIndex?: number; // 追蹤當前卡片位置
  onCardIndexChanged?: (index: number) => void; // 卡片索引變更時的回調
}

export const DeletionSwiper: React.FC<DeletionSwiperProps> = ({
  photos,
  onSwipeLeft,
  onSwipeRight,
  onSwipedAll,
  currentIndex = 0,
  onCardIndexChanged,
}) => {
  const { t } = useTranslation();

  if (!photos || photos.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>{t("home.no_photos")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Swiper
        cards={photos}
        renderCard={(card) => {
          // 檢查卡片是否為 null/undefined 以防萬一
          if (!card) return <ThemedView style={styles.card} />;

          return (
            <ThemedView style={styles.card}>
              <Image
                source={{ uri: card.uri }}
                style={styles.image}
                resizeMode="cover"
              />
              <ThemedText style={styles.date}>
                {new Date(card.creationTime).toLocaleDateString()}
              </ThemedText>
            </ThemedView>
          );
        }}
        onSwipedLeft={onSwipeLeft}
        onSwipedRight={onSwipeRight}
        onSwipedAll={onSwipedAll}
        onSwiped={(cardIndex) => {
          // 通知父組件卡片索引變更
          onCardIndexChanged?.(cardIndex);
        }}
        cardIndex={currentIndex}
        backgroundColor={"transparent"}
        stackSize={3}
        cardVerticalMargin={20}
        overlayLabels={{
          left: {
            title: t("common.delete"),
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
            title: t("common.keep"),
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
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40, // 調整 swiper 預設邊距
  },
  card: {
    flex: 0.8, // 佔據大部分螢幕
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
