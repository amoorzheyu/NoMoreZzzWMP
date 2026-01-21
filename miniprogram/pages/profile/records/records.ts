import { getRecords } from '../../../api/checkin';
import { getDaysInMonth, getFirstDayOfMonth } from '../../../utils/time';

Page({
  data: {
    currentYear: 0,
    currentMonth: 0,
    
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [] as any[],
    
    summary: null as any,
  },
  
  onLoad() {
    const now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
    });
    
    this.loadRecords();
  },
  
  /**
   * 上一个月
   */
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    
    this.setData({ currentYear, currentMonth });
    this.loadRecords();
  },
  
  /**
   * 下一个月
   */
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    
    this.setData({ currentYear, currentMonth });
    this.loadRecords();
  },
  
  /**
   * 加载打卡记录
   */
  async loadRecords() {
    try {
      const { currentYear, currentMonth } = this.data;
      const result = await getRecords(currentYear, currentMonth);
      
      // 生成日历数据
      const calendarDays = this.generateCalendar(result.records);
      
      this.setData({
        calendarDays,
        summary: result.summary,
      });
    } catch (error) {
      console.error('加载打卡记录失败:', error);
    }
  },
  
  /**
   * 生成日历数据
   */
  generateCalendar(records: any[]): any[] {
    const { currentYear, currentMonth } = this.data;
    const today = new Date();
    
    // 获取本月天数和第一天是星期几
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
    
    // 创建日历数组
    const calendar: any[] = [];
    
    // 填充空白天数
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendar.push({ date: null });
    }
    
    // 填充实际天数
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = records.find(r => r.date === dateStr);
      
      const isToday = 
        today.getFullYear() === currentYear &&
        today.getMonth() + 1 === currentMonth &&
        today.getDate() === day;
      
      let status = '';
      if (record && record.checked) {
        status = 'checked';
      }
      if (isToday) {
        status += ' today';
      }
      
      calendar.push({
        date: dateStr,
        day,
        status: status.trim(),
        isToday,
      });
    }
    
    return calendar;
  },
});
