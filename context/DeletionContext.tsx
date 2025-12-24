import { Asset } from "expo-media-library";
import React, { createContext, useContext, useState } from "react";

interface DeletionContextType {
  markedForDeletion: Asset[];
  markForDeletion: (photo: Asset) => void;
  unmarkForDeletion: (photoId: string) => void;
  clearDeletionList: () => void;
}

const DeletionContext = createContext<DeletionContextType | undefined>(
  undefined
);

export const DeletionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markedForDeletion, setMarkedForDeletion] = useState<Asset[]>([]);

  const markForDeletion = (photo: Asset) => {
    setMarkedForDeletion((prev) => {
      // Avoid duplicates
      if (prev.find((p) => p.id === photo.id)) return prev;
      return [...prev, photo];
    });
  };

  const unmarkForDeletion = (photoId: string) => {
    setMarkedForDeletion((prev) => prev.filter((p) => p.id !== photoId));
  };

  const clearDeletionList = () => {
    setMarkedForDeletion([]);
  };

  return (
    <DeletionContext.Provider
      value={{
        markedForDeletion,
        markForDeletion,
        unmarkForDeletion,
        clearDeletionList,
      }}
    >
      {children}
    </DeletionContext.Provider>
  );
};

export const useDeletion = () => {
  const context = useContext(DeletionContext);
  if (!context) {
    throw new Error("useDeletion must be used within a DeletionProvider");
  }
  return context;
};
