---
title: 15天学会React Native Skia 基础
date: 2025-10-29 23:55:04
tags:
---

# 大纲
1. Day 1：React Native Skia介绍与环境搭建 ✔️
2. Day 2：核心绘图元素
3. Day 3：动画基础概念
4. Day 4-5：基础动画
5. Day 6-7：路径与轨迹动画
6. Day 8-9：高级动画模式
7. Day 10：性能优化
8. Day 11-12：UI动画组件
9. Day 13-14：复杂动画案例
10. Day 15：项目整合与优化


# Day 1

## 1. 项目初始化
**新建**

```bash
npx @react-native-community/cli@latest init AwesomeProject
```
![new-rn](new.png)

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
|---|---|---|---|
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

# Day 2
## 1. Rect 矩形组件详解
```tsx
<Rect
  x={number}          // 左上角X坐标（必需）
  y={number}          // 左上角Y坐标（必需）
  width={number}      // 宽度（必需）
  height={number}     // 高度（必需）
  color={string}      // 填充颜色
/>
```

**属性详解表**
|属性|类型|必需|默认值|描述|
|---|---|---|---|---|
|x|number|✅|-|矩形左上角X坐标|
|y|number|✅|-|矩形左上角Y坐标|
|width|number|✅|-|矩形宽度|
|height|number|✅|-|矩形高度|
|color|string|❌|black|填充颜色|
|opacity|number|❌|1|透明度|0-1|

**使用示例**
```tsx
// 基础矩形
<Rect x={50} y={100} width={200} height={150} color="lightblue" />

// 半透明矩形
<Rect x={100} y={200} width={80} height={120} color="#ff6b6b" opacity={0.7} />

// 边框矩形（结合stroke样式）
<Rect 
  x={20} 
  y={20} 
  width={100} 
  height={60} 
  color="transparent"
  style="stroke"
  strokeWidth={2}
/>
```

## 2. RoundedRect 圆角矩形

### 创建方式一、**统一圆角**

```tsx
<RoundedRect
  x={number}          // 左上角X坐标
  y={number}          // 左上角Y坐标
  width={number}      // 宽度
  height={number}     // 高度
  r={number}          // 统一圆角半径
  color={string}      // 颜色
/>
```

### 创建方式二、**精细控制（推荐用于复杂设计）**

```tsx
<RoundedRect 
  color={string}
  rect={{
    rect: { 
      x: number, y: number,        // 位置
      width: number, height: number // 尺寸
    },
    topLeft: { x: number, y: number },      // 左上角圆角
    topRight: { x: number, y: number },     // 右上角圆角  
    bottomRight: { x: number, y: number },  // 右下角圆角
    bottomLeft: { x: number, y: number },   // 左下角圆角
  }}
/>
```

**圆角参数详解**

```tsx
// 圆形圆角
{ x: 20, y: 20 }    // 水平半径20px, 垂直半径20px → 圆形角

// 椭圆圆角  
{ x: 30, y: 15 }    // 水平半径30px, 垂直半径15px → 椭圆角

// 直角
{ x: 0, y: 0 }      // 没有圆角 → 直角
```

### 使用示例**
```tsx
// 统一圆角
<RoundedRect x={50} y={50} width={200} height={100} r={20} color="#4ecdc4" />

// 精细控制圆角
<RoundedRect 
  color="#45b7d1"
  rect={{
    rect: { x: 50, y: 200, width: 200, height: 100 },
    topLeft: { x: 30, y: 30 },       // 大圆角
    topRight: { x: 10, y: 10 },      // 小圆角
    bottomRight: { x: 30, y: 30 },   // 大圆角
    bottomLeft: { x: 0, y: 0 },      // 直角
  }}
/>

// 胶囊形状（圆形端点）
<RoundedRect 
  x={50} 
  y={350} 
  width={200} 
  height={50} 
  r={25}  // 半径 = 高度/2
  color="#96ceb4" 
/>
```

## 3. Line 线条组件

### 1. 创建
```tsx
<Line
  p1={Point}                 // 起点坐标（必需）
  p2={Point}                 // 终点坐标（必需）
  color={string}             // 线条颜色
  strokeWidth={number}       // 线条粗细
  strokeCap={string}         // 端点样式
  style={string}             // 填充样式
/>
```

**Point坐标的两种写法**

```tsx
// 方式一：使用vec工具函数（推荐）
import {vec} from "@shopify/react-native-skia";
p1={vec(0, 0)}

// 方式二：直接对象
p1={{x: 0, y: 0}}
```

### 2. strokeCap 端点样式详解

|值|效果|视觉示例|使用场景|
|---|---|---|---|
|"butt"|平头端点|━━━━━━|默认值，普通线条|
|"round"|圆头端点|●●●●●●|柔和视觉效果|
|"square"|方头端点|■■■■■■|强调线条端点|

## 4. Points 点集合组件
### 1. 创建

```tsx
<Points 
  points={Point[]}           // 点坐标数组（必需）
  mode={string}              // 连接模式
  color={string}             // 颜色
  style={string}             // 填充样式
  strokeWidth={number}       // 描边粗细
  strokeCap={string}         // 端点样式
/>
```

### 2. mode 模式详解

|mode|模式|特点|
|---|---|---|
|polygon|多边形模式|连接所有点形成封闭多边形|
|lines|连线模式|每两个点连成一条线|
|points|点模式|只显示点，不连接|

```tsx
import {vec} from "@shopify/react-native-skia";

// 五角星 - 多边形模式
<Points 
  points={[
    vec(100, 20), vec(125, 80), vec(190, 80), vec(140, 115), 
    vec(160, 180), vec(100, 140), vec(40, 180), vec(60, 115), 
    vec(10, 80), vec(75, 80), vec(100, 20)  // 闭合点
  ]}
  mode="polygon"
  color="gold"
  style="fill"
/>

// 折线图 - 连线模式
<Points 
  points={[
    vec(50, 200), vec(100, 150), vec(150, 180), 
    vec(200, 120), vec(250, 160)
  ]}
  mode="lines"
  color="#e74c3c"
  style="stroke"
  strokeWidth={3}
  strokeCap="round"
/>

// 散点图 - 点模式
<Points 
  points={[
    vec(80, 250), vec(120, 280), vec(160, 240), 
    vec(200, 260), vec(240, 220)
  ]}
  mode="points"
  color="#2ecc71"
  style="fill"
  strokeWidth={8}
  strokeCap="round"
/>
```

## 5. Text 文字组件

### 1. 示例
```tsx
<Text
  x={number}                // 基线X坐标（必需）
  y={number}                // 基线Y坐标（必需）
  text={string}             // 文字内容（必需）
  color={string}            // 文字颜色
  font={Font}               // 字体对象
  // 其他样式属性...
/>
```

### 2. 字体处理的三种方式

#### 2.1 方式一：useFont + 自定义字体（推荐）

```tsx
import {useFont} from "@shopify/react-native-skia";

const MyText = () => {
  const font = useFont(require("./assets/font.ttf"), 24);
  
  // 必须检查字体是否加载完成！
  if (!font) {
    return null; // 或者返回加载状态
  }
  
  return (
    <Canvas>
      <Text x={50} y={100} text="自定义字体" font={font} color="black" />
    </Canvas>
  );
};
```

#### 2.2 方式二：matchFont + 系统字体

```tsx
import {matchFont} from "@shopify/react-native-skia";
import {Platform} from "react-native";

const font = matchFont({
  fontFamily: Platform.select({ 
    ios: 'Helvetica', 
    android: 'sans-serif' 
  }),
  fontSize: 24,
  fontWeight: 'bold',
  fontStyle: 'italic'
});

<Text x={50} y={100} text="系统字体" font={font} color="blue" />
```

#### 2.3 方式三：Skia.Font 系统字体

```tsx
import {Skia} from "@shopify/react-native-skia";

const systemFont = Skia.Font(null, 24); // null表示系统默认

<Text x={50} y={100} text="默认字体" font={systemFont} color="black" />
```

### 3. 使用示例
```tsx
// 基础文字
<Text x={50} y={100} text="Hello Skia" color="black" />

// 带样式的文字
<Text 
  x={100} 
  y={150} 
  text="Styled Text" 
  color="#e74c3c"
  opacity={0.8}
/>

// 多行文字（使用多个Text组件）
<Text x={50} y={200} text="第一行文字" color="black" />
<Text x={50} y={230} text="第二行文字" color="black" />

// 手动居中对齐
const text = "居中文字";
const textWidth = font.getTextWidth(text);
const centerX = (canvasWidth - textWidth) / 2;

<Text x={centerX} y={100} text={text} font={font} color="black" />
```

**Tip: Text的(x,y)坐标对应文字基线左下角，不是左上角！**

## 6. Group 组容器

### 1. 创建
```tsx
<Group>
  {/* 相关的图形组件 */}
  <Circle ... />
  <Rect ... />
  <Line ... />
</Group>
```

### 2. Group的核心价值
1. 代码组织更加有序
2. 统一变换（为动画准备）
3. 层级管理

### 3. 使用示例
```tsx
// 组织笑脸组件
<Group>
  {/* 脸部 */}
  <Circle cx={100} cy={100} r={40} color="yellow" />
  
  {/* 眼睛组 */}
  <Group>
    <Circle cx={80} cy={90} r={6} color="black" />
    <Circle cx={120} cy={90} r={6} color="black" />
  </Group>
  
  {/* 嘴巴 */}
  <Path path="M 80 120 C 90 130 110 130 120 120" color="black" style="stroke" />
</Group>
```

## 7. 样式系统详解

**通用样式属性 - 所有图形组件都支持以下样式属性** 

|属性|值类型|默认值|描述|
|---|---|---|---|
|color|string|black|填充颜色|
|style|"fill"⎮"stroke"|"fill"|填充或描边模式|
|strokeWidth|number|1|描边粗细|
|opacity|number|1|透明度|0-1|
|blendMode|BlendMode|"srcOver"|混合模式|

**颜色格式支持**
```tsx
// 颜色名称
color="red"
color="lightblue"

// 十六进制
color="#ff0000"
color="#e74c3c"

// RGB
color="rgb(255, 0, 0)"
color="rgba(231, 76, 60, 0.5)"  // 带透明度

```

**透明度控制**
```tsx
// 方式一：使用opacity属性
<Circle cx={100} cy={100} r={50} color="red" opacity={0.5} />

// 方式二：使用rgba颜色
<Circle cx={100} cy={100} r={50} color="rgba(255, 0, 0, 0.5)" />

// 方式三：使用十六进制带透明度
<Circle cx={100} cy={100} r={50} color="#ff000080" />
```

## 8. 坐标系统深度理解
三大定位系统对比
|组件|定位点|坐标属性|示例|
|---|---|---|---|
|Rect|左上角|x, y|x={50} y={100}|
|Circle|圆心|cx, cy|cx={100} cy={100}|
|Line|两个端点|p1, p2|p1={vec(0,0)} p2={vec(100,100)}|
|Text|基线左下角|x, y|x={50} y={100}|

# Day 3 Path

## 1. Path 基础命令系统
|命令|全称|语法|描述|示例
|----|----|----|----|---|
|M|Move To|M x y|移动笔触到指定点|<Path path="M 100 100 L 200 200" />  从(100,100)画线到(200,200)|
|L|Line To|L x y|从当前点画直线到目标点|<Path path="M 50 50 L 150 50 L 150 150 L 50 150 Z" /> 绘制一个矩形|
|H|Horizontal Line|H x|水平线到X坐标|<Path path="M 50 50 H 150 V 150 H 50 V 50 Z" /> 用HV绘制矩形|
|V|Vertical Line|V y|垂直线到Y坐标|<Path path="M 50 50 H 150 V 150 H 50 V 50 Z" /> 用HV绘制矩形|
|C|Cubic Bezier|C x1 y1 x2 y2 x y|三次贝塞尔曲线|**|
|Q|Quadratic Bezier|Q x1 y1 x y|二次贝塞尔曲线|**|
|A|Arc|A rx ry rotation large-arc sweep x|圆弧|**|
|Z|Close Path|Z|闭合路径(自动连接最后一个点与第一个点)|<Path path="M 50 50 L 150 50 L 100 150 Z" /> 绘制三角形（自动闭合）|

## 2. Path 贝塞尔曲线

### 2.1 Q - 二次贝塞尔

```tsx
// Q controlX controlY endX endY
// Q 100 50 150 100

// 控制点决定曲线形状
<Path
  path="M 50 100 Q 100 50 150 100"
  color="blue"
  style="stroke"
  strokeWidth={3}
/>
```

### C - 三次贝塞尔

```tsx
// 语法: C control1X control1Y control2X control2Y endX endY  
"C 80 50 120 50 150 100"

// 更复杂的曲线控制
<Path
  path="M 50 100 C 80 50 120 50 150 100"
  color="red"
  style="stroke" 
  strokeWidth={3}
/>
```

## 3. 圆弧命令 (A) 

A rx ry rotation large-arc sweep x y

● rx, ry: 椭圆半径 (如果是圆，rx=ry)
● rotation: 椭圆旋转角度 (弧度)
● large-arc: 0=小弧, 1=大弧  
● sweep: 0=逆时针, 1=顺时针
● x, y: 终点坐标

```tsx
// 半圆 - 从(50,100)到(150,100)
<Path
  path="M 50 100 A 50 50 0 0 1 150 100"
  color="purple"
  style="stroke"
  strokeWidth={3}
/>

// 四分之一圆
<Path  
  path="M 100 50 A 50 50 0 0 1 150 100"
  color="orange"
  style="stroke"
  strokeWidth={3}
/>
```

## 5. Path 动画基础

```tsx
import {useValue, useEffect, withTiming} from "@shopify/react-native-skia";

const AnimatedPath = () => {
  const progress = useValue(0);
  
  useEffect(() => {
    progress.current = withTiming(1, {duration: 2000});
  }, []);
  
  return (
    <Canvas style={{ flex: 1 }}>
      <Path
        path={`M 50 100 
              C ${50 + 100 * progress.current} 50 
                ${150 - 100 * progress.current} 150 
                150 100`}
        color="blue"
        style="stroke"
        strokeWidth={3}
      />
    </Canvas>
  );
};
```