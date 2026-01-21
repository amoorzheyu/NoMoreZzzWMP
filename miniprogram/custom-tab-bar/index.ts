Component({
  data: {
    selected: 0,
    indicatorOffset: 0,
  },
  
  lifetimes: {
    attached() {
      // 计算初始指示器位置
      this.updateIndicator(0);
    },
  },
  
  methods: {
    switchTab(e: any) {
      const { index, path } = e.currentTarget.dataset;
      
      // 更新选中状态和指示器
      this.setData({ selected: index });
      this.updateIndicator(index);
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' });
      
      wx.switchTab({ url: path });
    },
    
    updateIndicator(index: number) {
      // 动态计算指示器位置
      const query = wx.createSelectorQuery().in(this);
      query.select('.tab-bar').boundingClientRect((rect: any) => {
        if (rect) {
          const tabWidth = rect.width / 3;
          const offset = index * tabWidth;
          this.setData({ indicatorOffset: offset });
        }
      }).exec();
    },
  },
});
