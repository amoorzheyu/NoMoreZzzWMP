// ===== 打卡模块 API =====

import request from './request';

export interface CheckInResult {
  id: string;
  checkInTime: string;
  checkInDate: string;
  checkInTimestamp: string;
  todayRank: number;
  continuousDays: number;
  totalDays: number;
}

export interface TodayStatus {
  checked: boolean;
  record?: {
    id: string;
    checkInTime: string;
    checkInDate: string;
    checkInTimestamp: string;
  };
}

export interface CheckInRecord {
  date: string;
  checkInTime: string | null;
  checked: boolean;
}

export interface MonthRecords {
  year: number;
  month: number;
  records: CheckInRecord[];
  summary: {
    totalDays: number;
    checkedDays: number;
    checkInRate: number;
    avgCheckInTime: string;
    earliestTime: string;
    latestTime: string;
  };
}

export interface Statistics {
  range: string;
  overview: {
    totalDays: number;
    continuousDays: number;
    avgCheckInTime: string;
    earliestTime: string;
    latestTime: string;
    checkInRate: number;
  };
  timeDistribution: Array<{
    timeRange: string;
    count: number;
  }>;
  dailyTrend: Array<{
    date: string;
    checkInTime: string | null;
  }>;
  heatmap: Array<{
    date: string;
    level: number;
  }>;
}

/**
 * 执行打卡
 */
export function checkIn(): Promise<CheckInResult> {
  return request.post('/checkin', {}, true);
}

/**
 * 获取今日打卡状态
 */
export function getTodayStatus(): Promise<TodayStatus> {
  return request.get('/checkin/today');
}

/**
 * 获取打卡记录
 */
export function getRecords(year: number, month: number): Promise<MonthRecords> {
  return request.get('/checkin/records', { year, month });
}

/**
 * 获取统计数据
 */
export function getStatistics(range: 'week' | 'month' | 'year' | 'all'): Promise<Statistics> {
  return request.get('/checkin/statistics', { range });
}
