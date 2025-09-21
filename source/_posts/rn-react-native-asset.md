---
title: React Native Asset 简明使用指南
date: 2025-09-21 22:44:50
tags:
- react-native
---

> `React Native Asset` 是一个简化 React Native 资源管理的工具，能够自动将字体、图片等资源文件链接到 iOS 和 Android 平台，无需手动配置。

## 1. 安装
```bash
npm install --save-dev react-native-asset
# 或
yarn add --dev react-native-asset
```

## 2. 基本配置
**我的资源目录如下**
![folder](folder.png)
在项目根目录创建或修改 `react-native.config.js` 文件, 添加资源链接：

```js
module.exports = {
  assets: [
    './src/assets/fonts',
    './src/assets/images/files',
    './src/assets/animations/files'
  ]
}
```

## 3. 使用方法
1. 自动链接资源
安装后，资源会自动链接到相应平台：
```bash
# 安装依赖后自动执行
npm install

# 或手动执行
npx react-native-asset
```

2. 不过更好的方法是配置 `package.json`

```json
{
  "scripts": {
    "assets": "react-native-asset"
  }
}
```

这样做的好处,当新添加了资源之后执行 `yarn assets`,可以在git历史中减少大批量ios资源的改动


> 在项目中正常使用即可