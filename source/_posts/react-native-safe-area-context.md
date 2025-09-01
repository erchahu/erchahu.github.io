---
title: react native 中 react-native-safe-area-context 使用
date: 2025-08-28 17:05:39
tags:
  - react-native
---

## 1. 下载 & 使用

**[官网传送门](https://appandflow.github.io/react-native-safe-area-context/)**

> 在过去的 `React Native` 开发中，通常使用 `SafeAreaView` 组件（来自 `react-native`）来处理 `iPhone X` 及以后型号的刘海屏问题。但它有几个局限性：
> - 仅限 `iOS`： 在 `Android` 上无效。
> - 功能有限： 只能作为 `View` 组件使用，无法获取具体的 `padding` 或 `margin` 值。
> `react-native-safe-area-context` 解决了所有这些问题：
> - 跨平台： 完美支持 `iOS` 和 `Android`。
> - 更灵活： 不仅提供了一个 `SafeAreaView` 组件，还提供了 `Hook` 和 `Consumer` 组件，可以获取到安全区域的精确数值（如 `top`, `bottom`, `left`, `right`），从而可以在任何地方（如样式、普通 View、绝对定位元素）自由地使用这些值。
> - 社区标准： 它是 `React Navigation` 等流行库的依赖项，已经成为处理安全区域的事实标准。
> **简单来说，只要你开发的 `App` 需要全屏显示，并且要适配各种异形屏设备，就必须使用这个库。**

### 1.1 核心概念
安全区域（Safe Area）： 指的是屏幕上不会被设备外壳（如刘海）、操作系统 UI（如状态栏、虚拟导航栏）遮挡的可视区域。你的关键内容应该放在安全区域内。

这个库的核心就是帮你获取到这个安全区域相对于整个屏幕的边界尺寸（通常是 `{ top: number, right: number, bottom: number, left: number }`）。

### 1.2 版本支持

|react-native-safe-area-context version | react-native version |
|-|-|
| 5.x	| >= 0.74 |
| 4.x	| 0.64 - 0.74 |

### 1.3 下载

```bash
# npm
npm install react-native-safe-area-context

# yarn
yarn add react-native-safe-area-context
```

### 1.4使用

- 通常会使用 `SafeAreaProvider` 包裹应用的根组件

```typescript
// App.js
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation'; // 你的主要导航组件

function App() {
  return (
    // 用 SafeAreaProvider 包裹整个应用
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
```

- `SafeAreaProvider` 负责监听设备窗口的变化（如屏幕旋转）并计算安全区域的边界。只有在它的子组件中，才能使用这个库的其他 API。
- 不要在 动画视图(Animated)与滚动视图(ScrollView)中使用这个API, 否则会导致相当频繁的更新

**Props**

- 可以接受所有 View 的 props. 默认样式 : {flex: 1};
- initialMetrics
  - 可选, 默认为null
  - 可以提供刘海屏的初始值用于立即渲染

## 2. 主要 API 和使用方法

### 2.1 使用 SafeAreaView 组件

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

function MyComponent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>这个页面内容都在安全区域内！</Text>
      {/* View 的顶部和底部会自动添加 padding */}
    </SafeAreaView>
  );
}
```

> 如果可以,尽量使用 这个 API.

- 优点： 简单快捷，无需计算。
- 缺点： 不够灵活，你无法知道具体的 padding 值是多少。

### 2.2 使用 useSafeAreaInsets Hook

> 返回一个 insets 对象，包含了各个方向的安全区域大小

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

function MyComponent() {
  // 获取安全区域边界
  const insets = useSafeAreaInsets();

  return (
    // 手动为最外层的 View 添加 padding
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      <Text>这个页面内容也都在安全区域内！</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  }
});
```

优点: 
- 极致灵活： 可以在任何组件中使用（必须是 `SafeAreaProvider` 的子组件）。
- 控制力强： 可以决定将这些 `insets` 用在 `padding` 还是 `margin` 上，或者用在绝对定位的元素上。

**典型场景**
> 一个按钮始终贴在屏幕底部，但又不能低于底部安全区域

```tsx
function FloatingButton() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 10 + insets.bottom, // 10 是想要的间距，再加上安全区域的距离
        right: 10,
      }}
    >
      <Button title="Press me" />
    </View>
  );
}
```

### 4.3 使用 SafeAreaConsumer 组件（用于 Class Component）
> 如果还在使用类组件，无法使用 `Hook`，可以用这个。

```tsx
import { SafeAreaConsumer } from 'react-native-safe-area-context';

class MyClassComponent extends React.Component {
  render() {
    return (
      <SafeAreaConsumer>
        {(insets) => (
          <View style={{ paddingTop: insets?.top }}>
            <Text>Class component content</Text>
          </View>
        )}
      </SafeAreaConsumer>
    );
  }
}
```

## 3. 示例
> 一个典型的标签页导航页面，顶部是状态栏，底部是主页指示条（Home Indicator）或虚拟导航键

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StatusBar, ScrollView } from 'react-native';

function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    // 1. 为整个页面容器添加底部 padding，确保内容不被遮挡
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      {/* 2. 设置状态栏样式，并留出顶部安全距离 */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true} // 设置为透明且悬浮
      />
      {/* 3. ScrollView 的顶部内容从状态栏下面开始 */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top, // 重要：这样 ScrollView 的内容才会从状态栏下方开始
        }}
        style={{ flex: 1 }}
      >
        <Text>主要页面内容...</Text>
        {/* ... 更多内容 ... */}
      </ScrollView>

      {/* 4. 一个贴在底部的 Tab 栏 */}
      <View
        style={{
          height: 50,
          backgroundColor: 'lightgray',
          // 不需要再加 paddingBottom，因为外层容器已经处理了
        }}
      >
        <Text>Tab Bar</Text>
      </View>
    </View>
  );
}
```