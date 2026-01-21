// ===== 本地存储封装 =====

/**
 * 存储数据
 */
export function setStorage<T = any>(key: string, data: T): void {
  try {
    wx.setStorageSync(key, data);
  } catch (error) {
    console.error('setStorage error:', error);
  }
}

/**
 * 获取数据
 */
export function getStorage<T = any>(key: string, defaultValue?: T): T | undefined {
  try {
    const value = wx.getStorageSync(key);
    return value !== '' ? value : defaultValue;
  } catch (error) {
    console.error('getStorage error:', error);
    return defaultValue;
  }
}

/**
 * 删除数据
 */
export function removeStorage(key: string): void {
  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error('removeStorage error:', error);
  }
}

/**
 * 清空所有数据
 */
export function clearStorage(): void {
  try {
    wx.clearStorageSync();
  } catch (error) {
    console.error('clearStorage error:', error);
  }
}
