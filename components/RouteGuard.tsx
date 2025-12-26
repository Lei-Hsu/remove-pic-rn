import { useRouter, Href } from "expo-router";
import { ReactNode, useEffect } from "react";
import { ROUTES } from "../constants/routes";
import { usePurchaseStore } from "../stores/usePurchaseStore";

interface RouteGuardProps {
  children: ReactNode;
  requiresPremium?: boolean;
  redirectTo?: Href;
  fallback?: ReactNode;
}

/**
 * 路由守衛組件
 * 用於條件性渲染或重定向
 */
export const RouteGuard = ({
  children,
  requiresPremium = false,
  redirectTo = ROUTES.HOME,
  fallback = null,
}: RouteGuardProps) => {
  const router = useRouter();
  const isPremium = usePurchaseStore((state) => state.isPremium);

  useEffect(() => {
    if (requiresPremium && !isPremium) {
      console.log("[RouteGuard] Premium required, redirecting...");
      router.replace(redirectTo);
    }
  }, [isPremium, requiresPremium, redirectTo, router]);

  // 如果需要 Premium 但未訂閱，顯示 fallback 或 null
  if (requiresPremium && !isPremium) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
