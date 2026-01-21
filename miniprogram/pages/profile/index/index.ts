import { getUserProfile } from '../../../api/user';

Page({
  data: {
    userInfo: {
      nickName: '',
      avatarUrl: '',
      province: '',
      city: '',
    },
    
    statItems: [
      { label: '累计天数', value: 0 },
      { label: '连续天数', value: 0 },
      { label: '排名', value: '--' },
    ],
  },
  
  onShow() {
    // 更新自定义 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    
    this.loadUserProfile();
  },
  
  /**
   * 加载用户信息
   */
  async loadUserProfile() {
    try {
      const profile = await getUserProfile();
      
      this.setData({
        userInfo: {
          nickName: profile.nickName,
          avatarUrl: profile.avatarUrl,
          province: profile.province,
          city: profile.city,
        },
        statItems: [
          { label: '累计天数', value: profile.statistics.totalDays },
          { label: '连续天数', value: profile.statistics.continuousDays },
          { label: '排名', value: `#${profile.statistics.nationalRank}` },
        ],
      });
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },
  
  /**
   * 跳转到编辑资料
   */
  goToEdit() {
    wx.navigateTo({ url: '/pages/profile/edit/edit' });
  },
  
  /**
   * 跳转到打卡记录
   */
  goToRecords() {
    wx.navigateTo({ url: '/pages/profile/records/records' });
  },
  
  /**
   * 跳转到统计分析
   */
  goToStatistics() {
    wx.navigateTo({ url: '/pages/profile/statistics/statistics' });
  },
  
  /**
   * 跳转到设置
   */
  goToSettings() {
    wx.navigateTo({ url: '/pages/profile/settings/settings' });
  },
  
  /**
   * 跳转到关于
   */
  goToAbout() {
    wx.showModal({
      title: '醒了么',
      content: '版本: v1.0.0\n一个帮助你早起的小程序',
      showCancel: false,
    });
  },
});
