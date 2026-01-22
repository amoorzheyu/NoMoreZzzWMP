import { uploadAvatar, updateUserProfile } from '../../../api/user';

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    avatarUploading: false,
    canSubmit: false,
    statusBarHeight: 0,
  },

  onLoad() {
    // 获取状态栏高度
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
  },

  /**
   * 选择头像
   */
  async onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail;
    
    if (!avatarUrl) {
      return;
    }
    
    console.log('选择头像:', avatarUrl);
    
    // 先使用临时路径，让用户可以继续操作
    this.setData({ 
      avatarUrl: avatarUrl,  // 临时路径
      avatarUploading: true 
    });
    
    // 立即检查状态，让按钮可用
    this.checkCanSubmit();
    
    // 后台上传到服务器
    try {
      const result = await uploadAvatar(avatarUrl);
      console.log('头像上传成功:', result);
      
      // 上传成功后替换为服务器URL
      this.setData({ 
        avatarUrl: result.avatarUrl,
        avatarUploading: false,
      });
      
      wx.showToast({ 
        title: '头像上传成功', 
        icon: 'success',
        duration: 1500,
      });
    } catch (error) {
      console.error('头像上传失败:', error);
      
      // 即使上传失败，也保留临时路径，让用户可以继续
      this.setData({ avatarUploading: false });
      
      // 提示用户，但不阻止继续操作
      console.warn('头像将在提交时重新上传');
    }
  },

  /**
   * 输入昵称 - 实时输入
   */
  onNickNameInput(e: any) {
    const nickName = e.detail.value;
    this.setData({ nickName: nickName.trim() });
    this.checkCanSubmit();
  },

  /**
   * 昵称输入框失焦 - 使用微信昵称时触发
   */
  onNickNameBlur(e: any) {
    const nickName = e.detail.value;
    console.log('昵称失焦:', nickName);
    this.setData({ nickName: nickName.trim() });
    this.checkCanSubmit();
  },

  /**
   * 昵称变化 - 使用微信昵称时触发
   */
  onNickNameChange(e: any) {
    const nickName = e.detail.value;
    console.log('昵称变化:', nickName);
    this.setData({ nickName: nickName.trim() });
    this.checkCanSubmit();
  },

  /**
   * 检查是否可以提交
   */
  checkCanSubmit() {
    const { avatarUrl, nickName } = this.data;
    const canSubmit = !!(avatarUrl && nickName && nickName.length > 0);
    this.setData({ canSubmit });
    console.log('检查提交状态:', { avatarUrl, nickName, canSubmit });
  },

  /**
   * 开始使用
   */
  async handleStart() {
    const { nickName, avatarUrl, canSubmit } = this.data;
    
    console.log('点击开始使用:', { nickName, avatarUrl, canSubmit });
    
    if (!canSubmit) {
      wx.showToast({
        title: '请先完善信息',
        icon: 'none',
      });
      return;
    }
    
    try {
      wx.showLoading({ title: '保存中...', mask: true });
      
      // 如果头像是临时路径，先上传
      let finalAvatarUrl = avatarUrl;
      if (avatarUrl && avatarUrl.includes('tmp')) {
        console.log('检测到临时头像，重新上传...');
        try {
          const result = await uploadAvatar(avatarUrl);
          finalAvatarUrl = result.avatarUrl;
          console.log('头像上传成功:', finalAvatarUrl);
        } catch (error) {
          console.error('头像上传失败，但继续保存昵称:', error);
        }
      }
      
      // 保存用户信息
      await updateUserProfile({ nickName, avatarUrl: finalAvatarUrl });
      
      wx.hideLoading();
      
      // 跳转到首页
      wx.reLaunch({ 
        url: '/pages/index/index',
        success: () => {
          wx.showToast({
            title: '欢迎使用！',
            icon: 'success',
            duration: 2000,
          });
        },
      });
    } catch (error) {
      wx.hideLoading();
      console.error('保存失败:', error);
      wx.showToast({ 
        title: '保存失败，请重试', 
        icon: 'none',
        duration: 2000,
      });
    }
  },
});
