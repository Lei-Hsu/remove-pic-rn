import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { ROUTE_NAMES, AppRoute } from '../constants/routes';

/**
 * 路由追蹤 Hook
 * 用於分析和日誌記錄
 */
export const useRouteTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    const routeName = ROUTE_NAMES[pathname as AppRoute] || 'Unknown';
    console.log(`[Navigation] Current route: ${routeName} (${pathname})`);

    // 未來可整合分析服務
    // analytics.track('screen_view', { screen_name: routeName });
  }, [pathname]);

  return { pathname };
};
