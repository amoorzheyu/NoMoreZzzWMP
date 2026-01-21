import { getUserProfile, updateUserProfile, uploadAvatar } from '../../../api/user';

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    gender: 0,
    signature: '',
  },
  
  onLoad() {
    this.loadUserInfo();
  },
  
  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const profile = await getUserProfile();
      this.setData({
        avatarUrl: profile.avatarUrl,
        nickName: profile.nickName,
        gender: profile.gender,
        signature: profile.signature,
      });
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },
  
  /**
   * 选择头像
   */
  async onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail;
    
    try {
      // 上传头像
      const result = await uploadAvatar(avatarUrl);
      this.setData({ avatarUrl: result.avatarUrl });
      
      wx.showToast({ title: '头像上传成功', icon: 'success' });
    } catch (error) {
      console.error('上传头像失败:', error);
    }
  },
  
  /**
   * 输入昵称
   */
  onNickNameInput(e: any) {
    this.setData({ nickName: e.detail.value });
  },
  
  /**
   * 选择性别
   */
  selectGender(e: any) {
    const gender = parseInt(e.currentTarget.dataset.gender);
    this.setData({ gender });
  },
  
  /**
   * 输入个性签名
   */
  onSignatureInput(e: any) {
    this.setData({ signature: e.detail.value });
  },
  
  /**
   * 保存
   */
  async handleSave() {
    const { nickName, gender, signature } = this.data;
    
    if (!nickName.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    
    try {
      await updateUserProfile({
        nickName,
        gender,
        signature,
      });
      
      wx.showToast({ title: '保存成功', icon: 'success' });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('保存失败:', error);
    }
  },
});
