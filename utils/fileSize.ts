import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

/**
 * 使用檔案系統 API 取得實際檔案大小
 * 如果失敗則使用改進的估算方法
 */
async function getActualSize(asset: MediaLibrary.Asset): Promise<number> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(asset.uri);

    if (fileInfo.exists && "size" in fileInfo) {
      return fileInfo.size;
    }

    return estimateSizeImproved(asset);
  } catch (error) {
    console.warn(`Failed to get file size for ${asset.id}:`, error);
    return estimateSizeImproved(asset);
  }
}

/**
 * 改進的檔案大小估算
 * 使用更真實的 JPEG 壓縮率 (0.3 bytes/pixel 而非 3)
 */
function estimateSizeImproved(asset: MediaLibrary.Asset): number {
  const width = asset.width || 1920;
  const height = asset.height || 1080;
  // JPEG 通常壓縮到 0.2-0.5 bytes per pixel
  // 使用保守的 0.3 以提高準確度
  const bytesPerPixel = 0.3;
  return Math.floor(width * height * bytesPerPixel);
}

/**
 * 計算多個媒體資產的總文件大小
 * 使用實際檔案大小,如果無法取得則使用改進的估算值
 *
 * @param assets - MediaLibrary.Asset 物件的陣列
 * @param maxWaitMs - 最大等待時間（預設 5000ms）
 * @returns Total size in bytes
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
        `Timeout calculating ${assets.length - processedCount} remaining assets`
      );
      break;
    }

    try {
      const size = await getActualSize(asset);
      totalSize += size;
      processedCount++;
    } catch (error) {
      console.warn(`Failed to get size for ${asset.id}, using estimate`);
      totalSize += estimateSizeImproved(asset);
      processedCount++;
    }
  }

  return totalSize;
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
