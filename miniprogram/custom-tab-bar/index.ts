Component({
  data: {
    selected: 0,
  },
  
  methods: {
    onChange(e: any) {
      const index = e.detail;
      this.setData({ selected: index });
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' });
      
      // 路由跳转
      const paths = [
        '/pages/index/index',
        '/pages/ranking/ranking',
        '/pages/profile/index/index'
      ];
      
      wx.switchTab({ url: paths[index] });
    },
  },
});
