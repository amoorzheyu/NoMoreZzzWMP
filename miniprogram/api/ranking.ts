// ===== 排行榜模块 API =====

import request from './request';

export interface RankingUser {
  rank: number;
  userId: string;
  nickName: string;
  avatarUrl: string;
  province: string;
  city?: string;
  checkInTime?: string;
  totalDays?: number;
  avgCheckInTime?: string;
}

export interface TodayRanking {
  date: string;
  total: number;
  myRank: number;
  myCheckInTime: string;
  list: RankingUser[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ProvinceRanking {
  statDate: string;
  myProvince: {
    rank: number;
    province: string;
    avgCheckInTime: string;
    userCount: number;
  };
  list: Array<{
    rank: number;
    province: string;
    avgCheckInTime: string;
    userCount: number;
  }>;
}

export interface NationalRanking {
  type: 'total' | 'avg';
  total: number;
  myRank: number;
  list: RankingUser[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * 获取今日排行榜
 */
export function getTodayRanking(page: number = 1, pageSize: number = 20): Promise<TodayRanking> {
  return request.get('/ranking/today', { page, pageSize });
}

/**
 * 获取省份排行榜
 */
export function getProvinceRanking(): Promise<ProvinceRanking> {
  return request.get('/ranking/province');
}

/**
 * 获取全国排行榜
 */
export function getNationalRanking(
  type: 'total' | 'avg' = 'total',
  page: number = 1,
  pageSize: number = 20
): Promise<NationalRanking> {
  return request.get('/ranking/national', { type, page, pageSize });
}
