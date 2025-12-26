import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "@deletion_statistics";

export interface DeletionSession {
  id: string;
  date: string;
  photosDeleted: number;
  spaceFreed: number;
}

interface StatisticsStore {
  sessions: DeletionSession[];
  isLoading: boolean;

  totalPhotosDeleted: () => number;
  totalSpaceFreed: () => number;

  addSession: (photosDeleted: number, spaceFreed: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadStatistics: () => Promise<void>;
  saveStatistics: (newSessions: DeletionSession[]) => Promise<void>;
}

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  sessions: [],
  isLoading: true,

  totalPhotosDeleted: () => {
    const { sessions } = get();
    return sessions.reduce((sum, session) => sum + session.photosDeleted, 0);
  },

  totalSpaceFreed: () => {
    const { sessions } = get();
    return sessions.reduce((sum, session) => sum + session.spaceFreed, 0);
  },

  loadStatistics: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as DeletionSession[];
        set({ sessions: parsed });
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveStatistics: async (newSessions: DeletionSession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
      set({ sessions: newSessions });
    } catch (error) {
      console.error("Failed to save statistics:", error);
    }
  },

  addSession: async (photosDeleted: number, spaceFreed: number) => {
    const newSession: DeletionSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      photosDeleted,
      spaceFreed,
    };

    const updatedSessions = [newSession, ...get().sessions];
    await get().saveStatistics(updatedSessions);
  },

  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ sessions: [] });
    } catch (error) {
      console.error("Failed to clear statistics:", error);
    }
  },
}));

export const initializeStatisticsStore = async () => {
  const store = useStatisticsStore.getState();
  await store.loadStatistics();
};
