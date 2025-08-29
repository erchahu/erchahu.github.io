---
title: 新建 React-Native 项目
date: 2025-08-27 10:47:26
tags:
 - react-native
---

## 1. 前言

- node version: v20.19.4
- npm version: 10.8.2
- react-native version: 0.81.0

## 2. 初始化项目

  ```bash
  # 使用React Native CLI 初始化项目
  npx @react-native-community/cli@latest init myProject


  cd myProject

  # 启动Metro打包器
  npx react-native start

  # 新终端启动Android应用
  npx react-native run-android

  # 如果需要iOS（Mac only）
  npx react-native run-ios
  ```
  成功预览图如下:

  ![alt text](preview.png)

## 3. 提交到远程仓库

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/11/11.git
git push -u origin main
```

## 4. 添加项目依赖

### 4.1 添加 SafeAreaView
1. 官方地址 - [react-native-safe-area-context](https://appandflow.github.io/react-native-safe-area-context/)

2. 安装依赖:

```bash
npm install react-native-safe-area-context

# 或者
yarn add react-native-safe-area-context
```

3. 简单使用

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'pink' }}>
      <View style={{ flex: 1, backgroundColor: 'deeppink' }}>
        <Text>你好</Text>
      </View>
    </SafeAreaView>
  )
}
```

使用前后对比
![safe-area](safe-area.png)

详细使用请查阅博客: [react-native-safe-area-context使用教程](/2025/08/28/react-native-safe-area-context/)

### 4.2 添加 styled-components