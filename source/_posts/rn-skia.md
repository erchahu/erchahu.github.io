---
title: 15天学会React Native Skia 基础
date: 2025-10-29 23:55:04
tags:
---

# Day 1

## 1. 项目初始化
**新建**

```bash
npx @react-native-community/cli@latest init AwesomeProject
```
![alt text](new-rn.png)

**下载依赖**

```bash
yarn add @shopify/react-native-skia
```

## 2. Hello 第一个圆

```tsx
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {Canvas, Circle} from "@shopify/react-native-skia";

export const FirstSkia = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={0} cy={0} r={40} color="red" />
    </Canvas>
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FirstSkia />
    </SafeAreaProvider>
  );
}

export default App;

```

![alt text](day1-first-show.png)

## 3. 核心概念

### 3.1 Canvas - 画布容器

**什么是Canvas？**

```tsx
<Canvas style={{ flex: 1 }}>
  {/* 所有图形元素必须放在Canvas内部 */}
</Canvas>
```

**Canvas的特性：**
- 容器角色：所有Skia图形的父容器
- 必须存在：图形元素必须在Canvas内才能显示
- 样式控制：通过style属性设置尺寸、背景等
- 坐标系建立：定义了自己的坐标系统

**类比理解：**
- 🖼️ 相框 - 图形是照片，必须放在相框内
- 🎪 舞台 - 图形是演员，必须在舞台上表演
- 📝 纸张 - 图形是绘画，必须在纸上作画

### 3.2. Circle - 圆形组件

**基础语法：**
```tsx
<Circle
  cx={300}    // 圆心X坐标
  cy={100}    // 圆心Y坐标
  r={40}      // 半径
  color="red" // 颜色
/>
```

**参数详解：**
|参数|含义|示例|说明|
|cx|圆心X坐标|cx={300}|距离画布左边缘300像素|
|cy|圆心Y坐标|cy={100}|距离画布上边缘100像素|
|r|半径|r={40}|圆的半径为40像素|
|color|颜色|color="red"|支持颜色名或十六进制|

### 3.3. 坐标系统理解

**坐标系特点：**
![alt text](coordinate.png)

**规则：**
- 起点：左上角为(0,0)
- X轴：向右移动，数值增加
- Y轴：向下移动，数值增加
- 单位：像素(px)