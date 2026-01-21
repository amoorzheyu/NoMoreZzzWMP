// ===== 醒了么 - API 请求封装 =====

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: any;
  showLoading?: boolean;
  loadingText?: string;
}

interface Response<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

const BASE_URL = 'http://172.16.37.126:8080/v1';

// 错误码映射
const ERROR_MESSAGES: Record<number, string> = {
  10001: '参数错误',
  10002: '数据不存在',
  10003: '操作太频繁，请稍后再试',
  20001: '未登录',
  20002: 'Token已过期，请重新登录',
  20003: '权限不足',
  30001: '今日已打卡',
  30002: '打卡时间不在有效范围',
  50001: '服务器内部错误',
  50002: '数据库错误',
};

class Request {
  private token: string;

  constructor() {
    // 从本地存储读取 token
    this.token = '';
    const token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
  }

  /**
   * 设置 Token
   */
  setToken(token: string) {
    this.token = token;
    wx.setStorageSync('token', token);
  }

  /**
   * 清除 Token
   */
  clearToken() {
    this.token = '';
    wx.removeStorageSync('token');
  }

  /**
   * 获取 Token
   */
  getToken(): string {
    return this.token;
  }

  /**
   * 通用请求方法
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    const {
      url,
      method = 'GET',
      data,
      header = {},
      showLoading = false,
      loadingText = '加载中...',
    } = config;

    // 显示加载提示
    if (showLoading) {
      wx.showLoading({ title: loadingText, mask: true });
    }

    return new Promise<T>((resolve, reject) => {
      wx.request({
        url: `${BASE_URL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
          ...header,
        },
        success: (res) => {
          if (showLoading) {
            wx.hideLoading();
          }

          const response = res.data as Response<T>;

          // 成功
          if (response.code === 0) {
            resolve(response.data);
            return;
          }

          // 业务错误
          const errorMsg = ERROR_MESSAGES[response.code] || response.message || '请求失败';
          
          // Token 过期或未登录，清除登录状态并重新登录
          if (response.code === 20001 || response.code === 20002) {
            this.clearToken();
            // 触发重新登录
            const app = getApp();
            if (app && typeof app.checkLogin === 'function') {
              app.checkLogin().catch(() => {
                // 登录失败，跳转到首页
                wx.showToast({ title: '请重新登录', icon: 'none' });
                setTimeout(() => {
                  wx.reLaunch({ url: '/pages/index/index' });
                }, 1500);
              });
            } else {
              // 无法自动重新登录，跳转到首页
              wx.showToast({ title: errorMsg, icon: 'none' });
              setTimeout(() => {
                wx.reLaunch({ url: '/pages/index/index' });
              }, 1500);
            }
            reject(new Error(errorMsg));
            return;
          }

          // 其他错误
          wx.showToast({ title: errorMsg, icon: 'none' });
          reject(new Error(errorMsg));
        },
        fail: (error) => {
          if (showLoading) {
            wx.hideLoading();
          }

          console.error('Request failed:', error);
          wx.showToast({ title: '网络请求失败', icon: 'none' });
          reject(error);
        },
      });
    });
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, data?: any, showLoading = false): Promise<T> {
    return this.request<T>({ url, method: 'GET', data, showLoading });
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, showLoading = false): Promise<T> {
    return this.request<T>({ url, method: 'POST', data, showLoading });
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, showLoading = false): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data, showLoading });
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, data?: any, showLoading = false): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', data, showLoading });
  }

  /**
   * 上传文件
   */
  upload(url: string, filePath: string, name: string = 'file'): Promise<any> {
    wx.showLoading({ title: '上传中...', mask: true });

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${BASE_URL}${url}`,
        filePath,
        name,
        header: {
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
        success: (res) => {
          wx.hideLoading();
          
          const response = JSON.parse(res.data) as Response;
          if (response.code === 0) {
            resolve(response.data);
          } else {
            const errorMsg = ERROR_MESSAGES[response.code] || response.message || '上传失败';
            
            // Token 过期或未登录，清除登录状态并重新登录
            if (response.code === 20001 || response.code === 20002) {
              this.clearToken();
              const app = getApp();
              if (app && typeof app.checkLogin === 'function') {
                app.checkLogin().catch(() => {
                  wx.showToast({ title: '请重新登录', icon: 'none' });
                  setTimeout(() => {
                    wx.reLaunch({ url: '/pages/index/index' });
                  }, 1500);
                });
              }
            }
            
            wx.showToast({ title: errorMsg, icon: 'none' });
            reject(new Error(errorMsg));
          }
        },
        fail: (error) => {
          wx.hideLoading();
          console.error('Upload failed:', error);
          wx.showToast({ title: '上传失败', icon: 'none' });
          reject(error);
        },
      });
    });
  }
}

// 导出单例
export default new Request();
