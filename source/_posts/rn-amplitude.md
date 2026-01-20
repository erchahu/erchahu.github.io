---
title: 在React Native中添加埋点
date: 2026-01-20 11:38:09
tags:
  - react-native
---

## 前言
- 第三方依赖: [amplitude](https://amplitude.com/)

## Config
在正式使用之前,首先需要配置 amplitude 相关信息
- 注册 amplitude
- 在amplitude面板新建项目 ,获取项目key

## How to use for App

**下载依赖**: 
`yarn add @amplitude/analytics-react-native @react-native-async-storage/async-storage`

**初始化环境**

1. 方法封装

```ts
import { init } from '@amplitude/analytics-react-native';

// 可以将埋点相关方法提取到 公共文件util.ts
// AMPLITUDE_KEY 就是上文
export const initAmplitude = () => {
  init(AMPLITUDE_KEY, 'NULL', {
    disableCookies: true, // React Native中可以禁止 Cookies 技术 
    trackingOptions: { // 跟踪配置
      deviceManufacturer: true,
      deviceModel: true,
      ipAddress: false,
      language: true,
      osName: true,
      osVersion: true,
      platform: true
    }
  });
}
```

2. 使用 - 在APP初始化时就可以初始化Amplitude了
```ts
useEffect(() => {
  initAmplitude()
}, [])
```

到这一步基本初始化已经完成, 那么要怎么看到用户点击了什么按钮呢?

**点击推送**

1. 方法封装
```ts
// 方法封装
import { EventOptions } from '@amplitude/analytics-core';
import { init, track, setUserId } from '@amplitude/analytics-react-native';

type EventProps = Record<string, any>;

export const pushEvent = (eventName: string, eventProps?: EventProps, eventOptions?: EventOptions) => {
  console.log('[Amplitude Logger]:', eventName, eventProps); //打印即时日志
  track(eventName, eventProps, eventOptions); // 跟踪用户点击
}
```

2. 使用

直接使用封装好的方法即可

2.1 `pushEvent('click-hello');`
2.2 如需传参数: `pushEvent('click-hello', { firstClick: true });`

2.3 示例
```ts
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TouchableHighlight, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { initAmplitude, pushEvent, setAmplitudeUserId } from './utils/event';

function App() {

  useEffect(() => {
    initAmplitude()
  }, [])

  return (
    <SafeAreaProvider>
      <TouchableHighlight onPress={() => {
        pushEvent('click-hello');
      }} style={{ marginTop: 60, backgroundColor: '#f00' }}>
        <Text>你好</Text>
      </TouchableHighlight>
    </SafeAreaProvider>
  );
}

export default App;

```
2.3 查看效果
![userclick list](image-3.png)
![userclick profile](image-2.png)

**设置userId**

如果想如图中一样, 查看userId的轨迹,可以在 APP 中进行userId 的设置

1. 方法封装
```ts
import { setUserId } from '@amplitude/analytics-react-native';
export const setAmplitudeUserId = (userId: string) => {
  console.log('[Amplitude Logger user Id]:', userId)
  setUserId(userId)
}
```

2. 使用 - 在init之后进行设置即可

```tsx
useEffect(() => {
  initAmplitude()
  setAmplitudeUserId("AM-990998889")
}, [])
```

这样就可以看到上图中的userId了