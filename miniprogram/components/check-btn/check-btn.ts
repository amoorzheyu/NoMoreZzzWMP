Component({
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
    checkTime: {
      type: String,
      value: '',
    },
  },
  
  data: {
    pressing: false,
    animating: false,
  },
  
  methods: {
    onTouchStart() {
      if (this.data.checked || this.data.animating) return;
      
      this.setData({ pressing: true });
      
      // 轻微震动反馈
      wx.vibrateShort({ type: 'light' });
    },
    
    onTouchEnd() {
      this.setData({ pressing: false });
    },
    
    onTouchCancel() {
      this.setData({ pressing: false });
    },
    
    async handleTap() {
      if (this.data.checked || this.data.animating) return;
      
      // 中等强度震动
      wx.vibrateShort({ type: 'medium' });
      
      // 播放动画
      this.setData({ animating: true });
      
      // 触发打卡事件
      this.triggerEvent('checkin');
      
      // 动画结束后重置状态
      setTimeout(() => {
        this.setData({ animating: false });
      }, 600);
    },
  },
});
