import { checkIn, getTodayStatus } from '../../api/checkin';
import { getTodayRanking } from '../../api/ranking';
import { getUserProfile } from '../../api/user';
import { getSkyGradientStyle } from '../../utils/sky-gradient';
import request from '../../api/request';
import { 
  getStorageWithExpiry, 
  setStorageWithExpiry, 
  isDataChanged 
} from '../../utils/storage';

// 缓存键常量
const CACHE_KEY_TODAY_STATUS = 'INDEX_TODAY_STATUS_CACHE';
const CACHE_KEY_USER_STATS = 'INDEX_USER_STATS_CACHE';
const CACHE_KEY_TODAY_RANKING = 'INDEX_TODAY_RANKING_CACHE';

// 缓存过期时间（毫秒）
const CACHE_EXPIRY_USER_STATS = 5 * 60 * 1000; // 5分钟

// 格式化当前日期为 YYYY-MM-DD
function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
  isFirstLoad: true,
  
  async onLoad() {
    // 立即更新天空和时间（避免闪烁）
    this.updateSkyGradient();
    this.updateTime();
    
    // 尝试从缓存加载数据（首次加载优化）
    const hasCache = this.loadFromCache();
    
    // 如果有缓存，跳过 loading 状态
    if (hasCache) {
      this.setData({ loading: false });
      console.log('✅ 从缓存加载数据成功');
    }
  },
  
  async onShow() {
    // 更新自定义 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    
    // 开始时间更新
    this.startTimeUpdate();
    
    // 每次进入都静默刷新数据
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      await this.initPage();
    } else {
      // 后续进入：静默刷新（用户无感知）
      this.silentRefresh();
    }
  },
  
  onHide() {
    this.stopTimeUpdate();
  },
  
  onUnload() {
    this.stopTimeUpdate();
  },
  
  /**
   * 从缓存加载数据
   * @returns 是否有缓存数据
   */
  loadFromCache(): boolean {
    const today = getTodayDate();
    let hasCache = false;

    // 加载今日打卡状态缓存
    const cachedStatus = getStorageWithExpiry<{
      todayChecked: boolean;
      checkInTime: string;
    }>(CACHE_KEY_TODAY_STATUS);

    if (cachedStatus) {
      this.setData(cachedStatus);
      hasCache = true;
    }

    // 加载用户统计缓存
    const cachedStats = getStorageWithExpiry<{
      stats: {
        continuousDays: number;
        totalDays: number;
      };
    }>(CACHE_KEY_USER_STATS);

    if (cachedStats) {
      this.setData(cachedStats);
      hasCache = true;
    }

    // 加载今日排行缓存
    const cachedRanking = getStorageWithExpiry<{
      todayRankingList: any[];
    }>(CACHE_KEY_TODAY_RANKING);

    if (cachedRanking) {
      this.setData(cachedRanking);
      hasCache = true;
    }

    return hasCache;
  },

  /**
   * 初始化页面（首次加载）
   */
  async initPage() {
    try {
      // 等待登录完成（最多等待5秒）
      await this.waitForLogin();

      // 并行加载，减少等待时间
      await Promise.all([
        this.loadTodayStatus(true),
        this.loadUserStats(true),
        this.loadTodayRanking(true),
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
   * 静默刷新（后台更新数据）
   */
  async silentRefresh() {
    try {
      // 等待登录完成
      await this.waitForLogin();

      // 并行加载，静默更新
      await Promise.all([
        this.loadTodayStatus(false),
        this.loadUserStats(false),
        this.loadTodayRanking(false),
      ]);

      console.log('🔄 静默刷新完成');
    } catch (error) {
      console.error('静默刷新失败:', error);
      // 静默刷新失败不提示用户
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
   * @param forceUpdate 是否强制更新界面（首次加载为 true，静默刷新为 false）
   */
  async loadTodayStatus(forceUpdate: boolean = false) {
    try {
      const status = await getTodayStatus();
      const today = getTodayDate();
      
      const newData = {
        todayChecked: status.checked && !!status.record,
        checkInTime: status.checked && status.record 
          ? status.record.checkInTime.substring(0, 5) 
          : '',
      };

      // 比较数据是否有变化
      const oldData = {
        todayChecked: this.data.todayChecked,
        checkInTime: this.data.checkInTime,
      };

      const hasChanged = isDataChanged(oldData, newData);

      // 只有数据变化或强制更新时才更新界面
      if (hasChanged || forceUpdate) {
        this.setData(newData);
        
        if (!forceUpdate && hasChanged) {
          console.log('📊 打卡状态有更新');
        }
      }

      // 更新缓存（按日期过期）
      setStorageWithExpiry(CACHE_KEY_TODAY_STATUS, newData, 0, today);
    } catch (error) {
      console.error('加载打卡状态失败:', error);
      if (forceUpdate) {
        throw error;
      }
    }
  },
  
  /**
   * 加载用户统计
   * @param forceUpdate 是否强制更新界面（首次加载为 true，静默刷新为 false）
   */
  async loadUserStats(forceUpdate: boolean = false) {
    try {
      const profile = await getUserProfile();
      
      // 处理空值情况，使用默认值（新用户或无打卡记录是正常场景）
      const newData = {
        stats: {
          continuousDays: profile?.statistics?.continuousDays || 0,
          totalDays: profile?.statistics?.totalDays || 0,
        },
      };

      // 比较数据是否有变化
      const oldData = {
        stats: this.data.stats,
      };

      const hasChanged = isDataChanged(oldData, newData);

      // 只有数据变化或强制更新时才更新界面
      if (hasChanged || forceUpdate) {
        this.setData(newData);
        
        if (!forceUpdate && hasChanged) {
          console.log('📊 用户统计有更新');
        }
      }

      // 更新缓存（5分钟过期）
      setStorageWithExpiry(CACHE_KEY_USER_STATS, newData, CACHE_EXPIRY_USER_STATS);
    } catch (error) {
      console.error('加载用户统计失败:', error);
      if (forceUpdate) {
        throw error;
      }
    }
  },
  
  /**
   * 加载今日排行
   * @param forceUpdate 是否强制更新界面（首次加载为 true，静默刷新为 false）
   */
  async loadTodayRanking(forceUpdate: boolean = false) {
    try {
      const ranking = await getTodayRanking(1, 3);
      const today = getTodayDate();
      
      // 添加空值检查
      if (!ranking || !ranking.list || !Array.isArray(ranking.list)) {
        console.warn('今日排行数据为空');
        return;
      }
      
      const list = ranking.list.slice(0, 3).map(item => ({
        ...item,
        checkInTime: item.checkInTime ? item.checkInTime.substring(0, 5) : '',
      }));

      const newData = {
        todayRankingList: list,
      };

      // 比较数据是否有变化
      const oldData = {
        todayRankingList: this.data.todayRankingList,
      };

      const hasChanged = isDataChanged(oldData, newData);

      // 只有数据变化或强制更新时才更新界面
      if (hasChanged || forceUpdate) {
        this.setData(newData);
        
        if (!forceUpdate && hasChanged) {
          console.log('📊 今日排行有更新');
        }
      }

      // 更新缓存（按日期过期）
      setStorageWithExpiry(CACHE_KEY_TODAY_RANKING, newData, 0, today);
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
      
      // 刷新排行榜和统计数据（打卡后强制更新缓存）
      await Promise.all([
        this.loadTodayRanking(true),
        this.loadUserStats(true),
      ]);
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
   * 下拉刷新（强制更新）
   */
  async onPullDownRefresh() {
    try {
      await this.waitForLogin();
      
      // 强制刷新所有数据
      await Promise.all([
        this.loadTodayStatus(true),
        this.loadUserStats(true),
        this.loadTodayRanking(true),
      ]);
      
      console.log('🔄 下拉刷新完成');
    } catch (error) {
      console.error('下拉刷新失败:', error);
      this.showFriendlyError('刷新失败，请稍后再试');
    } finally {
      wx.stopPullDownRefresh();
    }
  },
});
