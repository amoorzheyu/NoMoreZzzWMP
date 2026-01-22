import { getUserProfile, UserProfile } from '../../../api/user';
import { getStorage, setStorage, isDataChanged } from '../../../utils/storage';

// 缓存键
const PROFILE_CACHE_KEY = 'user_profile';

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
    
    // 1. 先从缓存加载数据（如果有的话，立即显示）
    this.loadCachedProfile();
    
    // 2. 然后请求最新数据（静默更新）
    this.loadUserProfile();
  },
  
  /**
   * 从缓存加载用户信息
   */
  loadCachedProfile() {
    const cached = getStorage<UserProfile>(PROFILE_CACHE_KEY);
    if (cached) {
      this.updatePageData(cached);
    }
  },
  
  /**
   * 从服务器加载用户信息
   */
  async loadUserProfile() {
    try {
      const profile = await getUserProfile();
      const cached = getStorage<UserProfile>(PROFILE_CACHE_KEY);
      
      // 对比新旧数据，仅在数据变化时更新界面和缓存
      if (isDataChanged(cached, profile)) {
        console.log('[Profile] 数据有变化，更新缓存和界面');
        // 更新缓存
        setStorage(PROFILE_CACHE_KEY, profile);
        // 更新界面
        this.updatePageData(profile);
      } else {
        console.log('[Profile] 数据无变化，用户无感');
      }
    } catch (error) {
      console.error('[Profile] 加载用户信息失败:', error);
    }
  },
  
  /**
   * 更新页面数据
   */
  updatePageData(profile: UserProfile) {
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
