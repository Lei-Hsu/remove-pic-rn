import { useRouter } from 'expo-router';
import { ROUTES } from '../constants/routes';

/**
 * 應用程式導航 Hook
 * 提供型別安全的導航方法
 */
export const useAppNavigation = () => {
  const router = useRouter();

  return {
    // 主要導航
    goToHome: () => router.push(ROUTES.HOME),
    goToConfirmation: () => router.push(ROUTES.CONFIRMATION),
    goToModal: () => router.push(ROUTES.MODAL),

    // 分頁導航
    goToStats: () => router.push(ROUTES.TABS.EXPLORE),

    // 通用方法
    goBack: () => router.back(),
    canGoBack: () => router.canGoBack(),

    // 原始 router（特殊情況使用）
    router,
  };
};
