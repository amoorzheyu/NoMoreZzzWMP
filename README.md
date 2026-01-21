# 醒了么 🏃‍♂️

目前是个Vibe coding的基础版本，已跑通，我会慢慢完善，点个star关注一下吧~~~

> 一个帮助你早起的微信小程序，培养良好的作息习惯

[![微信小程序](https://img.shields.io/badge/微信小程序-可用-green.svg)](https://mp.weixin.qq.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![微信开发者工具](https://img.shields.io/badge/微信开发者工具-最新版-orange.svg)](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 📁 项目结构

```
miniprogram/
├── api/                      # API 接口层
│   ├── request.ts           # 请求封装
│   ├── user.ts              # 用户接口
│   ├── checkin.ts           # 打卡接口
│   └── ranking.ts           # 排行榜接口
│
├── components/              # 公共组件
│   ├── check-btn/           # 打卡按钮
│   ├── toast/               # Toast 提示
│   ├── stat-card/           # 统计卡片
│   └── rank-item/           # 排行榜项
│
├── pages/                   # 页面
│   ├── index/               # 首页（打卡页）
│   ├── ranking/             # 榜单页
│   └── profile/             # 个人中心
│       ├── index/           # 个人中心主页
│       ├── records/         # 打卡记录
│       ├── statistics/      # 统计分析
│       ├── edit/            # 编辑资料
│       └── settings/        # 设置
│
├── styles/                  # 样式系统
│   ├── _variables.scss      # 变量定义
│   ├── _mixins.scss         # 混入
│   ├── _reset.scss          # 样式重置
│   └── _animation.scss      # 动画定义
│
├── utils/                   # 工具函数
│   ├── sky-gradient.ts      # 天空渐变计算
│   ├── storage.ts           # 本地存储封装
│   └── time.ts              # 时间处理
│
├── app.json                 # 小程序配置
├── app.scss                 # 全局样式
└── app.ts                   # 应用入口
```

## 🎨 设计系统

### 色彩

- **主色**: `#FF6B35` (日出橙)
- **成功**: `#10B981` (薄荷绿)
- **文字**: `#0F172A` / `#475569`
- **背景**: `#FAFBFC` / `#FFFFFF`

### 间距

- 基于 8rpx 的倍数系统
- xs: 8rpx, sm: 16rpx, md: 24rpx, lg: 32rpx, xl: 48rpx

### 圆角

- sm: 8rpx, md: 16rpx, lg: 24rpx, xl: 44rpx

## 🚀 功能模块

### 1. 打卡页 (pages/index)

- 动态天空背景（根据时间变化）
- 实时时钟显示
- 一键打卡功能
- 打卡统计展示
- 今日排行榜预览

### 2. 榜单页 (pages/ranking)

- 今日早起榜
- 坚持最久榜
- 各省份榜
- 下拉刷新
- 上拉加载更多

### 3. 个人中心 (pages/profile)

- 用户信息展示
- 打卡记录（日历视图）
- 统计分析
- 编辑资料
- 设置

## 🛠️ 技术栈

- **前端框架**: 原生微信小程序
- **开发语言**: TypeScript
- **样式预处理**: Sass/SCSS
- **状态管理**: 页面级状态 + 本地存储
- **网络请求**: 封装的 wx.request API

## 🚀 快速开始

### 环境要求

- 微信开发者工具 1.06.2307260 或以上版本
- Node.js 16.0+（用于类型检查）

### 开发步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/woke-up-miniprogram.git
   cd woke-up-miniprogram
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **打开微信开发者工具**
   - 导入项目，选择 `miniprogram` 目录
   - 填写你的 AppID
   - 开始开发

### 项目结构说明

```
miniprogram/
├── api/          # API 接口封装
├── components/   # 可复用组件
├── pages/        # 页面文件
├── styles/       # 样式系统
├── utils/        # 工具函数
└── assets/       # 静态资源
```

## 🎯 核心功能实现

### 天空渐变

根据当前时间自动切换天空背景色，营造早起氛围：

- 5:00 前：深夜
- 5:00-5:30：黎明前
- 5:30-6:00：晨曦
- 6:00-6:30：日出
- 6:30-7:30：清晨
- 7:30+：白天

### 打卡按钮

- 未打卡：显示"醒了"，橙色渐变
- 已打卡：显示打卡时间，绿色
- 点击动画：缩放 + 震动反馈
- 成功动画：600ms 弹性动画

### 日历视图

- 点阵式日历展示
- ● 表示已打卡
- ○ 表示未打卡
- 高亮今日
- 支持月份切换

## 📱 小程序配置

### TabBar

- 醒了（首页）
- 榜单
- 我的

### 页面路由

```
/pages/index/index              - 首页
/pages/ranking/ranking          - 榜单
/pages/profile/index/index      - 个人中心
/pages/profile/records/records  - 打卡记录
/pages/profile/statistics/statistics - 统计分析
/pages/profile/edit/edit        - 编辑资料
/pages/profile/settings/settings - 设置
```
## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范

- 使用 TypeScript 编写代码
- 遵循现有的代码风格和命名规范
- 提交前请确保代码通过类型检查
- 新功能请添加相应的测试用例

### 分支管理

- `main`: 主分支，稳定版本
- `develop`: 开发分支
- `feature/*`: 功能分支

## 📖 相关链接

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Sass 官方文档](https://sass-lang.com/documentation)

## 📄 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

---

## 📞 联系我们

如果你有任何问题或建议，欢迎通过以下方式联系：

- 提交 [GitHub Issue](https://github.com/amoorzheyu/NoMoreZzzWMP/issues)
- 发送邮件至：your-email@example.com

---

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**
