import { Asset } from "expo-media-library";
import { create } from "zustand";

interface DeletionStore {
  markedForDeletion: Asset[];
  markForDeletion: (photo: Asset) => void;
  unmarkForDeletion: (photoId: string) => void;
  clearDeletionList: () => void;
}

export const useDeletionStore = create<DeletionStore>((set) => ({
  markedForDeletion: [],

  markForDeletion: (photo) =>
    set((state) => {
      if (state.markedForDeletion.find((p) => p.id === photo.id)) {
        return state;
      }
      return { markedForDeletion: [...state.markedForDeletion, photo] };
    }),

  unmarkForDeletion: (photoId) =>
    set((state) => ({
      markedForDeletion: state.markedForDeletion.filter((p) => p.id !== photoId),
    })),

  clearDeletionList: () => set({ markedForDeletion: [] }),
}));
