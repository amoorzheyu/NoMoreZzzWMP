// ===== 用户模块 API =====

import request from './request';

export interface UserInfo {
  id: string;
  nickName: string;
  avatarUrl: string;
  gender: number;
  province: string;
  city: string;
  district: string;
  signature: string;
  isNewUser?: boolean;
}

export interface LoginResult {
  token: string;
  expiresIn: number;
  userInfo: UserInfo;
}

export interface UserProfile extends UserInfo {
  statistics: {
    totalDays: number;
    continuousDays: number;
    maxContinuousDays: number;
    avgCheckInTime: string;
    nationalRank: number;
  };
}

/**
 * 微信登录
 */
export function login(code: string): Promise<LoginResult> {
  return request.post('/user/login', { code }, true);
}

/**
 * 获取用户信息
 */
export function getUserProfile(): Promise<UserProfile> {
  return request.get('/user/profile');
}

/**
 * 更新用户信息
 */
export function updateUserProfile(data: {
  nickName?: string;
  gender?: number;
  signature?: string;
}): Promise<UserInfo> {
  return request.put('/user/profile', data, true);
}

/**
 * 上传头像
 */
export function uploadAvatar(filePath: string): Promise<{ avatarUrl: string }> {
  return request.upload('/user/avatar', filePath);
}

/**
 * 设置地区
 */
export function setRegion(data: {
  province: string;
  city: string;
  district: string;
}): Promise<{ province: string; city: string; district: string }> {
  return request.put('/user/region', data, true);
}
