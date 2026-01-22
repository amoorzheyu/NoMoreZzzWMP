// app.ts
import { login, getUserProfile } from './api/user';
import request from './api/request';

App({
  globalData: {
    userInfo: null,
    isLogging: false, // 防止重复登录的标志
  },
  
  async onLaunch() {
    console.log('App 启动');
    
    // 检查登录状态
    await this.checkLogin();
  },
  
  /**
   * 检查登录状态
   */
  async checkLogin() {
    // 防止重复登录
    if (this.globalData.isLogging) {
      console.log('正在登录中，跳过重复登录');
      return;
    }

    console.log('步骤1: 检查本地token');
    const token = request.getToken();
    
    if (token) {
      console.log('步骤1: 发现本地token，验证有效性');
      try {
        // 尝试获取用户信息来验证token有效性
        const userInfo = await getUserProfile();
        console.log('步骤1完成: token有效，使用现有token');
        this.globalData.userInfo = userInfo;
        
        // 检查用户是否需要完善信息
        this.checkUserInfoComplete(userInfo);
        return;
      } catch (error: any) {
        console.log('步骤1失败: token无效，清除token并重新登录');
        // token无效，清除并重新登录
        request.clearToken();
        this.globalData.userInfo = null;
        // 继续执行登录流程
      }
    }
    
    // 开始登录流程
    this.globalData.isLogging = true;
    
    try {
      console.log('步骤2: 调用wx.login()');
      const { code } = await wx.login();
      console.log('步骤2完成: 获取到code');
      
      if (code) {
        console.log('步骤3: 调用后端login API');
        const result = await login(code);
        console.log('步骤3完成: 登录成功');
        
        request.setToken(result.token);
        this.globalData.userInfo = result.userInfo;
        
        console.log('登录流程全部完成');
        
        // 检查用户是否需要完善信息
        this.checkUserInfoComplete(result.userInfo);
      }
    } catch (error: any) {
      console.log('登录流程失败于步骤:', error.message);
      // 登录失败时清除可能的无效token
      request.clearToken();
      this.globalData.userInfo = null;
    } finally {
      this.globalData.isLogging = false;
    }
  },
  
  /**
   * 检查用户信息是否完善
   */
  checkUserInfoComplete(userInfo: any) {
    // 如果昵称或头像为空，跳转到完善信息页面
    if (!userInfo.nickName || !userInfo.avatarUrl) {
      console.log('用户信息未完善，跳转到完善信息页面');
      wx.reLaunch({
        url: '/pages/profile/setup/setup',
      });
    }
  },
});
