import { getTodayRanking, getNationalRanking, getProvinceRanking } from '../../api/ranking';

Page({
  data: {
    activeTab: 0,
    
    // 今日早起榜
    todayList: [],
    todayPage: 1,
    
    // 坚持最久榜
    continuousList: [],
    continuousPage: 1,
    
    // 省份榜
    provinceData: {
      myProvince: {
        rank: 0,
        province: '',
        avgCheckInTime: '',
        userCount: 0,
      },
      list: [],
    },
    
    // 我的排名
    myRank: 0,
    total: 0,
    
    // 加载状态
    loading: false,
    refreshing: false,
    noMore: false,
  },
  
  onLoad() {
    this.loadRankingData();
  },
  
  onShow() {
    // 更新自定义 TabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },
  
  /**
   * 切换 Tab
   */
  onTabChange(e: any) {
    const tab = e.detail.name || e.detail.index;
    this.setData({ activeTab: tab });
    
    // 切换后加载数据
    this.loadRankingData();
  },
  
  /**
   * 下拉刷新
   */
  async onRefresh() {
    this.setData({ refreshing: true });
    
    // 重置分页
    this.setData({
      todayPage: 1,
      continuousPage: 1,
      noMore: false,
    });
    
    await this.loadRankingData();
    this.setData({ refreshing: false });
  },
  
  /**
   * 加载更多
   */
  async onLoadMore() {
    if (this.data.loading || this.data.noMore || this.data.activeTab === 2) {
      return;
    }
    
    const { activeTab, todayPage, continuousPage } = this.data;
    
    if (activeTab === 0) {
      this.setData({ todayPage: todayPage + 1 });
      await this.loadTodayRanking(false);
    } else if (activeTab === 1) {
      this.setData({ continuousPage: continuousPage + 1 });
      await this.loadContinuousRanking(false);
    }
  },
  
  /**
   * 加载榜单数据
   */
  async loadRankingData() {
    const { activeTab } = this.data;
    
    if (activeTab === 0) {
      await this.loadTodayRanking(true);
    } else if (activeTab === 1) {
      await this.loadContinuousRanking(true);
    } else if (activeTab === 2) {
      await this.loadProvinceRanking();
    }
  },
  
  /**
   * 加载今日早起榜
   */
  async loadTodayRanking(reset: boolean = false) {
    try {
      this.setData({ loading: true });
      
      const page = reset ? 1 : this.data.todayPage;
      const result = await getTodayRanking(page, 20);
      
      const list = reset ? result.list : [...this.data.todayList, ...result.list];
      
      this.setData({
        todayList: list,
        myRank: result.myRank,
        total: result.total,
        noMore: result.list.length < 20,
      });
    } catch (error) {
      console.error('加载今日排行失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },
  
  /**
   * 加载坚持最久榜
   */
  async loadContinuousRanking(reset: boolean = false) {
    try {
      this.setData({ loading: true });
      
      const page = reset ? 1 : this.data.continuousPage;
      const result = await getNationalRanking('total', page, 20);
      
      const list = reset ? result.list : [...this.data.continuousList, ...result.list];
      
      this.setData({
        continuousList: list,
        myRank: result.myRank,
        total: result.total,
        noMore: result.list.length < 20,
      });
    } catch (error) {
      console.error('加载全国排行失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },
  
  /**
   * 加载省份排行
   */
  async loadProvinceRanking() {
    try {
      this.setData({ loading: true });
      
      const result = await getProvinceRanking();
      
      this.setData({
        provinceData: result,
        myRank: result.myProvince.rank,
        total: result.list.length,
        noMore: true,
      });
    } catch (error) {
      console.error('加载省份排行失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },
});
