// ===== 时间处理工具 =====

/**
 * 格式化时间
 */
export function formatTime(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const pad = (n: number) => n.toString().padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', pad(month))
    .replace('DD', pad(day))
    .replace('HH', pad(hour))
    .replace('mm', pad(minute))
    .replace('ss', pad(second));
}

/**
 * 获取当前时间（时:分:秒）
 */
export function getCurrentTime(): string {
  const now = new Date();
  return formatTime(now, 'HH:mm:ss');
}

/**
 * 获取当前日期（年-月-日）
 */
export function getCurrentDate(): string {
  const now = new Date();
  return formatTime(now, 'YYYY-MM-DD');
}

/**
 * 解析时间字符串（HH:mm:ss）为时分秒
 */
export function parseTime(timeStr: string): { hour: number; minute: number; second: number } {
  const parts = timeStr.split(':');
  return {
    hour: parseInt(parts[0] || '0', 10),
    minute: parseInt(parts[1] || '0', 10),
    second: parseInt(parts[2] || '0', 10),
  };
}

/**
 * 判断是否是同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 获取指定月份的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 获取指定月份第一天是星期几（0-6）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}
