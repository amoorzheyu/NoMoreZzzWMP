// ===== 统一的错误处理 =====

/**
 * 友好的错误信息映射
 */
const ERROR_MESSAGES: Record<string, string> = {
  // 通用错误
  '参数错误': '哎呀，数据格式好像不对',
  '数据不存在': '找不到相关数据了',
  '操作太频繁，请稍后再试': '操作太快了，休息一下吧 ☕',
  
  // 认证错误
  '未登录': '需要先登录才能继续哦 👋',
  'Token已过期，请重新登录': '登录过期了，重新登录一下吧',
  '权限不足': '没有权限进行这个操作',
  
  // 打卡错误
  '今日已打卡': '今天已经打过卡啦，明天见 😊',
  '打卡时间不在有效范围': '现在还不是打卡时间哦 ⏰',
  
  // 网络错误
  '网络请求失败': '网络好像断了，检查一下吧 📡',
  '服务器内部错误': '服务器累了，稍后再试试',
  '数据库错误': '数据库出了点小问题',
};

/**
 * 获取友好的错误信息
 */
export function getFriendlyErrorMessage(error: string): string {
  return ERROR_MESSAGES[error] || '出了点小问题，稍后再试试吧';
}

/**
 * 显示错误提示
 */
export function showError(message: string) {
  const friendlyMessage = getFriendlyErrorMessage(message);
  wx.showToast({
    title: friendlyMessage,
    icon: 'none',
    duration: 2000,
  });
}

/**
 * 处理 API 错误
 */
export function handleApiError(error: any) {
  console.error('API Error:', error);
  
  let message = '未知错误';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error.message) {
    message = error.message;
  }
  
  showError(message);
}
