Component({
  data: {
    visible: false,
    message: '',
    animationClass: '',
  },
  
  methods: {
    /**
     * 显示 Toast
     */
    show(message: string, duration: number = 1500) {
      this.setData({
        visible: true,
        message,
        animationClass: 'toast-in',
      });
      
      // 持续显示一段时间后隐藏
      setTimeout(() => {
        this.hide();
      }, duration);
    },
    
    /**
     * 隐藏 Toast
     */
    hide() {
      this.setData({ animationClass: 'toast-out' });
      
      // 等待退出动画结束后移除
      setTimeout(() => {
        this.setData({ visible: false });
      }, 300);
    },
  },
});
