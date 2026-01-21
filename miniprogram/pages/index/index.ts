import { checkIn, getTodayStatus } from '../../api/checkin';
import { getTodayRanking } from '../../api/ranking';
import { getUserProfile } from '../../api/user';
import { getSkyGradientStyle } from '../../utils/sky-gradient';
import request from '../../api/request';

Page({
  data: {
    // 加载状态
    loading: true,
    
    // 天空渐变
    skyGradient: '',
    
    // 当前时间
    currentTime: {
      hours: '00',
      minutes: '00',
      seconds: '00',
    },
    
    // 打卡状态
    todayChecked: false,
    checkInTime: '',
    
    // 统计数据
    stats: {
      continuousDays: 0,
      totalDays: 0,
    },
    
    // 今日排行
    todayRankingList: [],
  },
  
  timeTimer: null as any,
  
  async onLoad() {
    // 立即更新天空和时间（避免闪烁）
    this.updateSkyGradient();
    this.updateTime();
    
    // 并行加载所有数据
    await this.initPage();
  },
  
  onShow() {
    // 更新自定义 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    
    // 开始时间更新
    this.startTimeUpdate();
  },
  
  onHide() {
    this.stopTimeUpdate();
  },
  
  onUnload() {
    this.stopTimeUpdate();
  },
  
  /**
   * 初始化页面
   */
  async initPage() {
    try {
      // 等待登录完成（最多等待5秒）
      await this.waitForLogin();

      // 并行加载，减少等待时间
      await Promise.all([
        this.loadTodayStatus(),
        this.loadUserStats(),
        this.loadTodayRanking(),
      ]);
    } catch (error) {
      console.error('页面初始化失败:', error);
      this.showFriendlyError('加载失败，请下拉刷新重试');
    } finally {
      // 最小加载时间 500ms，避免闪烁
      setTimeout(() => {
        this.setData({ loading: false });
      }, 500);
    }
  },

  /**
   * 等待登录完成
   */
  async waitForLogin(): Promise<void> {
    const maxWaitTime = 5000; // 最多等待5秒
    const checkInterval = 100; // 每100ms检查一次
    let waitedTime = 0;

    return new Promise((resolve) => {
      const checkToken = () => {
        const token = request.getToken();
        if (token || waitedTime >= maxWaitTime) {
          console.log('登录状态确认:', token ? '已登录' : '超时');
          resolve();
          return;
        }

        waitedTime += checkInterval;
        setTimeout(checkToken, checkInterval);
      };

      checkToken();
    });
  },
  
  /**
   * 开始时间更新
   */
  startTimeUpdate() {
    this.updateTime();
    
    this.timeTimer = setInterval(() => {
      this.updateTime();
      
      // 每分钟更新一次天空渐变
      const now = new Date();
      if (now.getSeconds() === 0) {
        this.updateSkyGradient();
      }
    }, 1000) as unknown as number;
  },
  
  /**
   * 停止时间更新
   */
  stopTimeUpdate() {
    if (this.timeTimer) {
      clearInterval(this.timeTimer);
      this.timeTimer = null;
    }
  },
  
  /**
   * 更新时间显示（优化：批量更新减少 setData）
   */
  updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 只有时分秒都变化时才更新
    const { currentTime } = this.data;
    if (currentTime.hours !== hours || currentTime.minutes !== minutes || currentTime.seconds !== seconds) {
      this.setData({
        currentTime: { hours, minutes, seconds },
      });
    }
  },
  
  /**
   * 更新天空渐变
   */
  updateSkyGradient() {
    const gradient = getSkyGradientStyle();
    this.setData({ skyGradient: gradient });
  },
  
  /**
   * 加载今日打卡状态
   */
  async loadTodayStatus() {
    try {
      const status = await getTodayStatus();
      
      if (status.checked && status.record) {
        const time = status.record.checkInTime.substring(0, 5);
        this.setData({
          todayChecked: true,
          checkInTime: time,
        });
      }
    } catch (error) {
      console.error('加载打卡状态失败:', error);
      throw error;
    }
  },
  
  /**
   * 加载用户统计
   */
  async loadUserStats() {
    try {
      const profile = await getUserProfile();
      this.setData({
        stats: {
          continuousDays: profile.statistics.continuousDays,
          totalDays: profile.statistics.totalDays,
        },
      });
    } catch (error) {
      console.error('加载用户统计失败:', error);
      throw error;
    }
  },
  
  /**
   * 加载今日排行
   */
  async loadTodayRanking() {
    try {
      const ranking = await getTodayRanking(1, 3);
      
      const list = ranking.list.slice(0, 3).map(item => ({
        ...item,
        checkInTime: item.checkInTime ? item.checkInTime.substring(0, 5) : '',
      }));
      
      this.setData({ todayRankingList: list });
    } catch (error) {
      console.error('加载今日排行失败:', error);
      // 排行榜加载失败不影响主流程
    }
  },
  
  /**
   * 处理打卡
   */
  async handleCheckIn() {
    try {
      const result = await checkIn();
      
      const time = result.checkInTime.substring(0, 5);
      
      this.setData({
        todayChecked: true,
        checkInTime: time,
        stats: {
          continuousDays: result.continuousDays,
          totalDays: result.totalDays,
        },
      });
      
      // 友好的成功提示
      const toast = this.selectComponent('#toast');
      if (toast) {
        const messages = [
          `太棒了！今日排名 #${result.todayRank} 🎉`,
          `打卡成功！你是第 ${result.todayRank} 个醒来的人 ✨`,
          `完美！已经连续 ${result.continuousDays} 天了 💪`,
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        toast.show(randomMsg, 2000);
      }
      
      // 刷新排行榜
      await this.loadTodayRanking();
    } catch (error: any) {
      console.error('打卡失败:', error);
      this.showFriendlyError(this.getFriendlyErrorMessage(error.message));
    }
  },
  
  /**
   * 显示友好的错误提示
   */
  showFriendlyError(message: string) {
    const toast = this.selectComponent('#toast');
    if (toast) {
      toast.show(message, 2000);
    }
  },
  
  /**
   * 转换为友好的错误信息
   */
  getFriendlyErrorMessage(error: string): string {
    const friendlyMessages: Record<string, string> = {
      '今日已打卡': '今天已经打过卡啦，明天再来吧 😊',
      '打卡时间不在有效范围': '现在还不是打卡时间哦 ⏰',
      '网络请求失败': '网络好像断了，检查一下网络吧 📡',
      '未登录': '需要先登录才能打卡哦 👋',
    };
    
    return friendlyMessages[error] || '出了点小问题，稍后再试试吧';
  },
  
  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    await this.initPage();
    wx.stopPullDownRefresh();
  },
});
