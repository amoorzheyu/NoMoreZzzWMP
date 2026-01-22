import request from '../../../api/request';
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  /**
   * 清除缓存
   */
  clearCache() {
    Dialog.confirm({
      title: '提示',
      message: '确定要清除缓存吗？',
    })
      .then(() => {
        try {
          wx.clearStorageSync();
          wx.showToast({ title: '清除成功', icon: 'success' });
        } catch (error) {
          console.error('清除缓存失败:', error);
          wx.showToast({ title: '清除失败', icon: 'error' });
        }
      })
      .catch(() => {
        // 用户取消
      });
  },
  
  /**
   * 退出登录
   */
  handleLogout() {
    Dialog.confirm({
      title: '退出登录',
      message: '确定要退出登录吗？',
    })
      .then(() => {
        // 清除 token
        request.clearToken();
        
        // 跳转到首页
        wx.reLaunch({ url: '/pages/index/index' });
      })
      .catch(() => {
        // 用户取消
      });
  },
});
