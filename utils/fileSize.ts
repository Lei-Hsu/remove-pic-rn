import * as MediaLibrary from "expo-media-library";

/**
 * 計算多個媒體資產的總文件大小
 * 使用估計值（寬度 × 高度 × 3 bytes per pixel）
 * 注意：expo-media-library 不提供實際的 fileSize 在 AssetInfo 中
 *
 * @param assets - MediaLibrary.Asset 物件的陣列
 * @param maxWaitMs - 最大等待時間（預設 5000ms）
 * @returns Estimated total size in bytes
 */
export async function calculateAssetsSize(
  assets: MediaLibrary.Asset[],
  maxWaitMs: number = 5000
): Promise<number> {
  if (assets.length === 0) return 0;

  const startTime = Date.now();
  let totalSize = 0;
  let processedCount = 0;

  for (const asset of assets) {
    // 檢查是否已超過等待時間
    if (Date.now() - startTime > maxWaitMs) {
      // 根據目前的平均大小估計剩餘的大小
      if (processedCount > 0) {
        const avgSize = totalSize / processedCount;
        const remainingCount = assets.length - processedCount;
        totalSize += avgSize * remainingCount;
      }
      console.warn(
        `File size calculation timeout after ${processedCount}/${assets.length} assets. Using estimation for remaining.`
      );
      break;
    }

    try {
      // 注意：expo-media-library 的 AssetInfo 不包含 fileSize 屬性
      // 目前我們使用基于尺寸的估計值
      // 為了準確的大小，考慮使用 expo-file-system 與 localUri
      const size = estimateSize(asset);
      totalSize += size;
      processedCount++;
    } catch (error) {
      // If estimation fails, use fallback
      console.warn(
        `Failed to estimate size for asset ${asset.id}, using default`
      );
      totalSize += estimateSize(asset);
      processedCount++;
    }
  }

  return totalSize;
}

/**
 * 根據資產尺寸估計文件大小
 * 粗略公式：寬度 × 高度 × 3 bytes per pixel (for JPEG compression)
 *
 * @param asset - MediaLibrary.Asset 物件
 * @returns Estimated size in bytes
 */
function estimateSize(asset: MediaLibrary.Asset): number {
  const width = asset.width || 1920;
  const height = asset.height || 1080;
  // 假設 ~3 bytes per pixel for JPEG compression
  return width * height * 3;
}

/**
 * 格式化字節為人類可讀的字符串
 *
 * @param bytes - 字節數
 * @param decimals - 小數位數（預設 2）
 * @returns 格式化字符串（例如，"2.3 MB", "1.5 GB"）
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(dm)} ${sizes[i]}`;
}

/**
 * 從格式化字符串獲取字節值
 * 有用於解析存儲的值
 *
 * @param formattedSize - 格式化大小字符串（例如，"2.3 MB")
 * @returns 字節數
 */
export function parseBytesFromString(formattedSize: string): number {
  const match = formattedSize.match(/^([\d.]+)\s*(\w+)$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  const sizes: { [key: string]: number } = {
    BYTES: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  return value * (sizes[unit] || 1);
}
