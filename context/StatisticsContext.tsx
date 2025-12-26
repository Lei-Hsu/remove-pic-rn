import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@deletion_statistics";

// 刪除會話資料結構
export interface DeletionSession {
  id: string; // UUID
  date: string; // ISO timestamp
  photosDeleted: number; // 刪除的照片數量
  spaceFreed: number; // 釋放的空間（bytes）
}

interface StatisticsContextType {
  sessions: DeletionSession[];
  totalPhotosDeleted: number;
  totalSpaceFreed: number;
  addSession: (photosDeleted: number, spaceFreed: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  isLoading: boolean;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(
  undefined
);

export const StatisticsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<DeletionSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 從 AsyncStorage 載入統計資料
  const loadStatistics = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as DeletionSession[];
        setSessions(parsed);
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 儲存統計資料到 AsyncStorage
  const saveStatistics = async (newSessions: DeletionSession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
      setSessions(newSessions);
    } catch (error) {
      console.error("Failed to save statistics:", error);
    }
  };

  // 新增一個刪除會話
  const addSession = async (photosDeleted: number, spaceFreed: number) => {
    const newSession: DeletionSession = {
      id: Date.now().toString(), // 簡單的 ID 生成
      date: new Date().toISOString(),
      photosDeleted,
      spaceFreed,
    };

    const updatedSessions = [newSession, ...sessions]; // 最新的在前面
    await saveStatistics(updatedSessions);
  };

  // 清除所有歷史記錄
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSessions([]);
    } catch (error) {
      console.error("Failed to clear statistics:", error);
    }
  };

  // 計算總計
  const totalPhotosDeleted = sessions.reduce(
    (sum, session) => sum + session.photosDeleted,
    0
  );

  const totalSpaceFreed = sessions.reduce(
    (sum, session) => sum + session.spaceFreed,
    0
  );

  // 在元件掛載時載入資料
  useEffect(() => {
    loadStatistics();
  }, []);

  const value: StatisticsContextType = {
    sessions,
    totalPhotosDeleted,
    totalSpaceFreed,
    addSession,
    clearHistory,
    isLoading,
  };

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};

// 使用 Statistics context 的自定義 hook
export const useStatistics = (): StatisticsContextType => {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error("useStatistics must be used within a StatisticsProvider");
  }
  return context;
};
