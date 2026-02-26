<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

<p align="center">
  <a href="https://v2.vuejs.org/"><img src="https://img.shields.io/badge/Vue-2.x-brightgreen.svg" alt="Vue2" /></a>
  <a href="https://tdesign.tencent.com/uniapp/getting-started"><img src="https://img.shields.io/badge/TDesign-Uniapp-0052d9.svg" alt="TDesign" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" /></a>
</p>

# TDesign Uniapp Vue2 HBuilderX 示例

基于 Vue 2 + TDesign Uniapp 的 HBuilderX 示例项目，集成了 [tdesign-uniapp](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp) 组件库插件。

## ✨ 特性

- 🎨 **TDesign 组件库** - 腾讯出品的企业级设计体系
- 📦 **开箱即用** - 完整的项目结构和配置，可直接在 HBuilderX 中运行
- 🌐 **多平台支持** - H5 / 微信 / 支付宝 / 抖音 / QQ / 百度等

## 🚀 快速开始

### 初始化

```bash
# 1. 克隆本项目到 tdesign-miniprogram 同级目录
git clone https://github.com/TDesignOteam/tdesign-uniapp-starter-vue2-hx.git

# 2. 在 tdesign-miniprogram 下执行初始化
cd tdesign-miniprogram
npm run uniapp -- run init
```

### 安装依赖

```bash
# 进入项目目录
cd tdesign-uniapp-starter-vue2-hx

# 安装依赖
npm install
```

### 开发

在 HBuilderX 中运行和调试。

## 📁 项目结构

```
├── App.vue                 # 根组件
├── main.js                 # 入口文件
├── pages.json              # 页面路由配置
├── manifest.json           # 应用配置
├── uni.scss                # uni-app 全局样式变量
├── postcss.config.js       # PostCSS 配置
├── index.html              # H5 入口
├── static/                 # 静态资源
├── scripts/                # 脚本工具
│   └── rpx-to-px.js        # rpx 转 px 脚本
├── uni_modules/
│   └── tdesign-uniapp/     # TDesign 组件库
└── package.json            # 项目依赖
```

## 🔗 相关链接

- [TDesign Uniapp 组件库](https://tdesign.tencent.com/uniapp/getting-started)
- [TDesign Uniapp 插件市场](https://ext.dcloud.net.cn/plugin?name=tdesign-uniapp)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 2 文档](https://v2.vuejs.org/)

## 📱 扫码预览

<img src="./docs/image/tdesign-uniapp-starter-vue2-hx-h5.png" width="300" />

## 📄 License

[MIT](LICENSE)
