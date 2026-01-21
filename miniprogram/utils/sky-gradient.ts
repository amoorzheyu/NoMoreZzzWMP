// ===== 天空渐变计算 =====

export interface SkyColor {
  start: string;
  end: string;
  angle: number;
}

/**
 * 根据当前时间计算天空渐变色
 */
export function getSkyGradient(hour: number, minute: number): SkyColor {
  const time = hour + minute / 60;
  
  if (time < 5) {
    // 深夜 - 深蓝到紫
    return { start: '#0f0c29', end: '#302b63', angle: 180 };
  } else if (time < 5.5) {
    // 黎明前 - 深紫到深蓝
    return { start: '#1a1a2e', end: '#16213e', angle: 180 };
  } else if (time < 6) {
    // 晨曦 - 深紫到橙红
    return { start: '#16213e', end: '#e94560', angle: 180 };
  } else if (time < 6.5) {
    // 日出 - 橙红到金黄
    return { start: '#e94560', end: '#ff6b35', angle: 170 };
  } else if (time < 7.5) {
    // 清晨 - 金黄到淡金
    return { start: '#ff6b35', end: '#ffb347', angle: 160 };
  } else {
    // 白天 - 淡金到天蓝
    return { start: '#ffb347', end: '#87ceeb', angle: 150 };
  }
}

/**
 * 将渐变色转换为 CSS 字符串
 */
export function getSkyGradientStyle(): string {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  const { start, end, angle } = getSkyGradient(hour, minute);
  return `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
}
