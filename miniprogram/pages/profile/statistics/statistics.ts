import { getStatistics } from '../../../api/checkin';

Page({
  data: {
    overview: {
      totalDays: 0,
      continuousDays: 0,
      avgCheckInTime: '--:--',
      checkInRate: 0,
    },
  },
  
  onLoad() {
    this.loadStatistics();
  },
  
  /**
   * 加载统计数据
   */
  async loadStatistics() {
    try {
      const result = await getStatistics('all');
      
      this.setData({
        overview: {
          totalDays: result.overview.totalDays,
          continuousDays: result.overview.continuousDays,
          avgCheckInTime: result.overview.avgCheckInTime.substring(0, 5),
          checkInRate: result.overview.checkInRate.toFixed(1),
        },
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  },
});
