/**
 * 應用程式路由常數
 * 使用此檔案管理所有路由路徑，確保型別安全和重構友善
 */

export const ROUTES = {
  // 主要路由
  HOME: "/",
  CONFIRMATION: "/confirmation",
  MODAL: "/modal",

  // 分頁路由
  TABS: {
    HOME: "/",
    EXPLORE: "/explore",
  },
} as const;

// 路由型別定義 - 從 ROUTES 自動推導
type MainRoutes = (typeof ROUTES)[keyof Omit<typeof ROUTES, "TABS">];
type TabRoutes = (typeof ROUTES.TABS)[keyof typeof ROUTES.TABS];
export type AppRoute = MainRoutes | TabRoutes;

// 路由參數型別（未來擴充用）
export type RouteParams = {
  [K in AppRoute]: undefined;
};

// 路由名稱映射（用於分析）
export const ROUTE_NAMES: Record<AppRoute, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.CONFIRMATION]: "Confirmation",
  [ROUTES.MODAL]: "Modal",
  [ROUTES.TABS.EXPLORE]: "Statistics",
};
