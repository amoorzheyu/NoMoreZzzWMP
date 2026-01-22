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

// ===== 带过期时间的存储 =====

interface StorageWithExpiry<T> {
  data: T;
  expiry: number; // 过期时间戳
  date?: string; // 数据对应的日期（用于按日期过期的数据）
}

/**
 * 存储数据（带过期时间）
 * @param key 存储键
 * @param data 数据
 * @param expiryMs 过期时间（毫秒），如果为 0 则按日期过期
 * @param date 数据对应的日期（YYYY-MM-DD），用于按日期过期的数据
 */
export function setStorageWithExpiry<T = any>(
  key: string,
  data: T,
  expiryMs: number = 0,
  date?: string
): void {
  try {
    const now = Date.now();
    const item: StorageWithExpiry<T> = {
      data,
      expiry: expiryMs > 0 ? now + expiryMs : 0,
      date,
    };
    wx.setStorageSync(key, item);
  } catch (error) {
    console.error('setStorageWithExpiry error:', error);
  }
}

/**
 * 获取数据（带过期检查）
 * @param key 存储键
 * @param defaultValue 默认值
 * @returns 数据或默认值（如果过期或不存在）
 */
export function getStorageWithExpiry<T = any>(
  key: string,
  defaultValue?: T
): T | undefined {
  try {
    const item = wx.getStorageSync(key) as StorageWithExpiry<T> | '';
    
    if (!item) {
      return defaultValue;
    }

    const now = Date.now();

    // 检查按时间戳过期
    if (item.expiry > 0 && now > item.expiry) {
      removeStorage(key);
      return defaultValue;
    }

    // 检查按日期过期
    if (item.date) {
      const today = formatDate(new Date());
      if (item.date !== today) {
        removeStorage(key);
        return defaultValue;
      }
    }

    return item.data;
  } catch (error) {
    console.error('getStorageWithExpiry error:', error);
    return defaultValue;
  }
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== 数据比较工具 =====

/**
 * 深度比较两个对象是否相等
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns 是否相等
 */
export function isEqual(obj1: any, obj2: any): boolean {
  // 处理基本类型
  if (obj1 === obj2) return true;
  
  // 处理 null 和 undefined
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  
  // 处理类型不同
  if (typeof obj1 !== typeof obj2) return false;
  
  // 处理数组
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => isEqual(item, obj2[index]));
  }
  
  // 处理对象
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => isEqual(obj1[key], obj2[key]));
  }
  
  return false;
}

/**
 * 检查数据是否有变化
 * @param oldData 旧数据
 * @param newData 新数据
 * @returns 是否有变化
 */
export function isDataChanged(oldData: any, newData: any): boolean {
  return !isEqual(oldData, newData);
}