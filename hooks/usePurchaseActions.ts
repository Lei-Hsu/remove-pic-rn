import { useTranslation } from "react-i18next";
import { usePurchaseStore } from "../stores/usePurchaseStore";

export const usePurchaseActions = () => {
  const { t } = useTranslation();
  const purchaseProduct = usePurchaseStore((state) => state.purchaseProduct);
  const restorePurchases = usePurchaseStore((state) => state.restorePurchases);

  return {
    purchaseProduct: () => purchaseProduct(t),
    restorePurchases: () => restorePurchases(t),
  };
};
