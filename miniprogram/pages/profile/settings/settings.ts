import request from '../../../api/request';

Page({
  /**
   * 清除缓存
   */
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync();
            wx.showToast({ title: '清除成功', icon: 'success' });
          } catch (error) {
            console.error('清除缓存失败:', error);
            wx.showToast({ title: '清除失败', icon: 'error' });
          }
        }
      },
    });
  },
  
  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除 token
          request.clearToken();
          
          // 跳转到首页
          wx.reLaunch({ url: '/pages/index/index' });
        }
      },
    });
  },
});
