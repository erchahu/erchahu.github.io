---
title: React Native 毛玻璃效果实现
date: 2025-09-18 16:33:22
tags:
- react-native
---

## 对比图
- 未加毛玻璃效果
![prev](prev.png)
![now](now.png)
## 如何做
1. 下载依赖: 使用 `@react-native-community/blur` 库

  ```bash
  npm install @react-native-community/blur --save
  # 或
  yarn add @react-native-community/blur
  ```

2. 使用示例

  ```ts
  import React from 'react';
  import { View, Image, Text, StyleSheet } from 'react-native';
  import { BlurView } from '@react-native-community/blur';

  {/* 毛玻璃效果层 */}
  <BlurView
    style={styles.absoluteFill}
    blurType="light" // 可选: dark, light, xlight, regular, prominent
    blurAmount={10} // 模糊程度 (0-100)
    reducedTransparencyFallbackColor="white" // 辅助功能关闭时的回退颜色
  />

  const styles = StyleSheet.create({
    absoluteFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });
  ```