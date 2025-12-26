# 導航架構文件

## 路由結構

### 主要路由
- `/` - 主畫面（照片清理）
- `/confirmation` - 確認刪除畫面（Modal presentation）
- `/modal` - 通用 Modal（保留）

### 分頁路由
- `/` - 分頁 1: 主畫面
- `/explore` - 分頁 2: 統計資料

## 導航模式

### 使用 useAppNavigation Hook（推薦）

```typescript
import { useAppNavigation } from '@/hooks/useAppNavigation';

const MyComponent = () => {
  const nav = useAppNavigation();

  // 導航到確認頁面
  nav.goToConfirmation();

  // 返回
  nav.goBack();
};
```

### 可用的導航方法

- `goToHome()` - 導航到主畫面
- `goToConfirmation()` - 導航到確認刪除頁面
- `goToModal()` - 導航到通用 Modal
- `goToStats()` - 導航到統計頁面
- `goBack()` - 返回上一頁
- `canGoBack()` - 檢查是否可以返回
- `router` - 原始 router 物件（特殊情況使用）

### 使用 Link 組件（靜態連結）

```typescript
import { Link } from 'expo-router';
import { ROUTES } from '@/constants/routes';

<Link href={ROUTES.TABS.EXPLORE}>Go to Stats</Link>
```

## 路由常數

所有路由路徑定義在 `constants/routes.ts`，請使用常數而非硬編碼字串。

```typescript
import { ROUTES } from '@/constants/routes';

// 使用路由常數
const route = ROUTES.CONFIRMATION; // '/confirmation'
const tabRoute = ROUTES.TABS.EXPLORE; // '/explore'
```

### 可用的路由常數

```typescript
ROUTES.HOME          // '/'
ROUTES.CONFIRMATION  // '/confirmation'
ROUTES.MODAL         // '/modal'
ROUTES.TABS.HOME     // '/'
ROUTES.TABS.EXPLORE  // '/explore'
```

## 路由守衛

使用 RouteGuard 組件保護需要 Premium 的路由：

```typescript
import { RouteGuard } from '@/components/RouteGuard';

<RouteGuard requiresPremium>
  {/* Premium 內容 */}
</RouteGuard>
```

### RouteGuard 參數

- `requiresPremium` - 是否需要 Premium 訂閱
- `redirectTo` - 未訂閱時重定向的路由（預設: `/`）
- `fallback` - 未訂閱時顯示的替代 UI

### 範例

```typescript
import { RouteGuard } from '@/components/RouteGuard';
import { ROUTES } from '@/constants/routes';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function PremiumFeatureScreen() {
  return (
    <RouteGuard
      requiresPremium
      redirectTo={ROUTES.HOME}
      fallback={
        <ThemedView>
          <ThemedText>Please upgrade to Premium to access this feature.</ThemedText>
        </ThemedView>
      }
    >
      <ThemedView>
        {/* Premium 功能內容 */}
      </ThemedView>
    </RouteGuard>
  );
}
```

## 路由追蹤

使用 `useRouteTracking` hook 追蹤當前路由（用於分析）：

```typescript
import { useRouteTracking } from '@/hooks/useRouteTracking';

const MyComponent = () => {
  const { pathname } = useRouteTracking();

  // 路由變更會自動記錄到 console
  // 未來可整合分析服務
};
```

## 最佳實踐

1. **使用路由常數** - 避免硬編碼路徑字串
   ```typescript
   // ✅ 好
   nav.goToConfirmation();
   <Link href={ROUTES.TABS.EXPLORE} />

   // ❌ 不好
   router.push('/confirmation');
   <Link href="/explore" />
   ```

2. **使用導航 Hook** - 提供更清晰的 API
   ```typescript
   // ✅ 好
   const nav = useAppNavigation();
   nav.goBack();

   // ❌ 不好
   const router = useRouter();
   router.back();
   ```

3. **路由守衛** - 聲明式保護路由
   ```typescript
   // ✅ 好
   <RouteGuard requiresPremium>
     <PremiumContent />
   </RouteGuard>

   // ❌ 不好
   {isPremium ? <PremiumContent /> : <Redirect to="/" />}
   ```

## 檔案結構

```
constants/
  └── routes.ts           # 路由常數定義

hooks/
  ├── useAppNavigation.ts # 導航 Hook
  └── useRouteTracking.ts # 路由追蹤 Hook

components/
  └── RouteGuard.tsx      # 路由守衛組件

app/
  ├── _layout.tsx         # Root Stack 配置
  ├── index.tsx           # 主畫面
  ├── confirmation.tsx    # 確認刪除頁面
  ├── modal.tsx           # 通用 Modal
  └── (tabs)/             # 分頁群組
      ├── _layout.tsx     # Tabs 配置
      ├── index.tsx       # 主畫面 Tab
      └── explore.tsx     # 統計頁面 Tab
```

## 導航流程圖

```
主畫面 (/)
  ├─ 滑動照片標記刪除
  ├─ 點擊「Review」→ /confirmation (Modal)
  │   ├─ 顯示待刪除列表
  │   ├─ 確認刪除
  │   └─ 顯示統計彈窗 → 返回主畫面
  └─ Premium 按鈕 → PremiumModal (組件彈窗，非路由)

底部分頁:
  ├─ Tab 1: 主畫面 (/)
  └─ Tab 2: 統計 (/explore)
```

## 型別定義

```typescript
// 所有應用程式路由的型別
type AppRoute =
  | '/'
  | '/confirmation'
  | '/modal'
  | '/explore';

// 路由參數（目前所有路由都無參數）
type RouteParams = {
  [ROUTES.HOME]: undefined;
  [ROUTES.CONFIRMATION]: undefined;
  [ROUTES.MODAL]: undefined;
  [ROUTES.TABS.HOME]: undefined;
  [ROUTES.TABS.EXPLORE]: undefined;
};
```

## 常見問題

### Q: 如何添加新路由？

1. 在 `constants/routes.ts` 添加新路由常數
2. 在 `app/` 目錄創建對應的檔案
3. 在 `useAppNavigation.ts` 添加導航方法（可選）
4. 更新 `ROUTE_NAMES` 映射（用於追蹤）

### Q: 如何在路由間傳遞參數？

目前路由不使用 URL 參數。如需共享狀態，使用 Zustand store：

```typescript
// 在發送方
const setSelectedPhoto = useDeletionStore(state => state.setSelectedPhoto);
setSelectedPhoto(photo);
nav.goToConfirmation();

// 在接收方
const selectedPhoto = useDeletionStore(state => state.selectedPhoto);
```

### Q: 路由守衛如何工作？

RouteGuard 組件在渲染時檢查 Premium 狀態：
- 如果需要 Premium 且未訂閱 → 重定向或顯示 fallback
- 如果不需要 Premium 或已訂閱 → 正常渲染 children

## 相關資源

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Expo Router API Reference](https://docs.expo.dev/router/reference/api-reference/)
- [TypeScript const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
