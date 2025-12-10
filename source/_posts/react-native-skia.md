---
title: react-native-skia
date: 2025-11-11 12:38:13
tags:
- react-native
---

## 1. 项目初始化
### 1.1 新建项目

```bash
npx @react-native-community/cli@latest init AwesomeProject
```
![new-rn](new-p.png)

**下载依赖**

```bash
yarn add @shopify/react-native-skia
```

### 1.2 Hello 第一个圆

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

## 2. Canvas

- Skia绘图的根组件, 所有图形元素必须放在Canvas内部
- 可当做普通 `React Native` 视图, 并且可以指定 `View` 
- 存在自己的坐标系统, 以左上角为原点(0, 0)

**Props**
|Name|Type|Description|
|----|----|----|----|
|style?|ViewStyle|
|ref?|Ref<SkiaView>|Reference to the SkiaView object|
|onSize?|SharedValue<Size>|Reanimated value to which the canvas size will be assigned (see canvas size)|

### 2.1 获取画布大小

**方案一: 使用UI**

```tsx
import {useSharedValue, useDerivedValue} from "react-native-reanimated";
import {Canvas, Rect} from "@shopify/react-native-skia";
import { memo } from "react";

const CanvasDemo = () => {
  const size = useSharedValue({ width: 100, height: 100 });
  const rect = useDerivedValue(() => {
    const {width, height} = size.value;
    console.log(width, height); // 100 100
    return { x: 0, y: 0, width, height };
  });

  return (
    <Canvas onSize={size} style={{ width:100, height: 100 }}>
      <Rect color="cyan" rect={rect} />
    </Canvas>
  );
};

export default memo(CanvasDemo)
```

**方案二: 使用JS**

使用 `useLayoutEffect` 与 `measure()` 一起可获取到 `canvas size`.

```tsx
import {useLayoutEffect, useState} from "react";
import {Fill, Canvas, Rect, useCanvasRef} from "@shopify/react-native-skia";

const Demo = () => {
  const ref = useCanvasRef();
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  useLayoutEffect(() => {
    ref.current?.measure((_x, _y, width, height) => {
      setRect({ x: 0, y: 0, width, height });
    });
  }, []);
  return (
    <Canvas style={{ flex: 1 }} ref={ref}>
      <Rect color="cyan" rect={rect} />
    </Canvas>
  );
};
```

`React Native Skia`提供了 `useCanvasSize` hook 可以用来获取

```tsx
const CanvasDemo2 = () => {
  const { size: { width, height } } = useCanvasSize();
  console.log(width, height, 'sera')

  return (
    <Canvas style={{ width:100, height: 100 }}>
    </Canvas>
  );
};
```

### 2.2 将Canvas内容保存为图片

使用 `makeImageSnapshot` 与 `makeImageSnapshotAsync` 进行导出.
- `makeImageSnapshot` 更简单,适合不包含 `textures`的.

```tsx
import {useEffect} from "react";
import {Canvas, useCanvasRef, Circle} from "@shopify/react-native-skia";

export const Demo = () => {
  const ref = useCanvasRef();
  useEffect(() => {
    setTimeout(() => {
      const image = ref.current?.makeImageSnapshot();
      if (image) {
        const bytes = image.encodeToBytes();
        console.log({ bytes });
      }
    }, 1000)
  });
  return (
    <Canvas style={{ flex: 1 }} ref={ref}>
      <Circle r={128} cx={128} cy={128} color="red" />
    </Canvas>
  );
};
```

### 2.3 Context 共享问题及其解决方案
`React Native Skia` 使用自己的渲染器，与 `React Native` 的主渲染器不同，导致 `Context` 无法自动传递

```tsx
<ThemeProvider>
  <Canvas>
    <MyComponent /> // 这里无法获取 ThemeContext
  </Canvas>
</ThemeProvider>
```

### 2.3.1 **推荐在Canvas外部准备数据**
```tsx
const MyScreen = () => {
  const theme = useTheme(); // 在Canvas外部获取context
  
  return (
    <Canvas style={{ flex: 1 }}>
      <MyDrawing primaryColor={theme.primary} /> // 通过props传递
    </Canvas>
  );
};
```

### 2.3.2 **也可以使用 高级方案 - Context Bridge**
```tsx
import { useContextBridge } from "its-fine";

const MyComponent = () => {
  // 1. 创建Context桥梁
  const ContextBridge = useContextBridge();
  
  return (
    <Canvas style={{ flex: 1 }}>
      {/* 2. 使用桥梁传递Context */}
      <ContextBridge>
        {/* 3. 现在内部组件可以访问外部Context了 */}
        <MyDrawing />
      </ContextBridge>
    </Canvas>
  );
};
```

**完整数据流**

```tsx
export const App = () => {
  return (
    <FiberProvider>           {/* 1. 提供Fiber支持 */}
      <ThemeProvider primary="red">  {/* 2. React世界的Context */}
        <Layer />                    {/* 3. 包含Canvas的组件 */}
      </ThemeProvider>
    </FiberProvider>
  );
};

export const Layer = () => {
  const ContextBridge = useContextBridge(); // 4. 创建桥梁
  
  return (
    <Canvas style={{ flex: 1 }}>
      <ContextBridge>               {/* 5. 使用桥梁 */}
        <Fill color="black" />
        <MyDrawing />               {/* 6. 现在可以访问ThemeContext了 */}
      </ContextBridge>
    </Canvas>
  );
};

const MyDrawing = () => {
  const { primary } = useTheme(); // 7. 成功获取Context数据！
  return <Fill color={primary} />; // 8. 使用红色填充
};
```

**some example 1 - 主题切换**
```tsx
// 深色/浅色主题在Canvas中的应用
const ThemedCanvas = () => {
  const ContextBridge = useContextBridge();
  const { isDarkMode, colors } = useTheme();
  
  return (
    <Canvas style={{ flex: 1 }}>
      <ContextBridge>
        <Background color={colors.background} />
        <Chart color={colors.primary} />
      </ContextBridge>
    </Canvas>
  );
};
```
**some example 2 - 用户配置**
```tsx
// 用户在设置中配置的绘图参数
const ConfigurableDrawing = () => {
  const ContextBridge = useContextBridge();
  
  return (
    <Canvas style={{ flex: 1 }}>
      <ContextBridge>
        <DrawingTool 
          brushSize={userSettings.brushSize}
          color={userSettings.favoriteColor}
        />
      </ContextBridge>
    </Canvas>
  );
};
```
**some example 3 - 多语言**
```tsx
// Canvas中显示本地化文字
const LocalizedChart = () => {
  const ContextBridge = useContextBridge();
  
  return (
    <Canvas style={{ flex: 1 }}>
      <ContextBridge>
        <Chart 
          title={t('chart.title')}
          labels={[t('chart.jan'), t('chart.feb')]}
        />
      </ContextBridge>
    </Canvas>
  );
};
```

## 3. Painting
### 3.1 Painting 是什么? 

> 就像给图形上色、加边框、设置特效一样，Painting 控制所有视觉样式。

但是不代表具体的元素

### 3.2 Painting 属性详解

#### 3.2.1 基础属性（直接设置）
| 属性 | 类型 | 默认值 | 描述 | 示例 |
|------|------|--------|------|------|
| color | string | "black" | 填充或描边颜色 | `color="red"`<br>`color="#ff0000"`<br>`color="rgb(255,0,0)"` |
| style | "fill" \| "stroke" | "fill" | 绘制样式 | `style="fill"` - 填充<br>`style="stroke"` - 描边 |
| strokeWidth | number | 1 | 描边线条粗细 | `strokeWidth={5}` |
| strokeCap | "butt" \| "round" \| "square" | "butt" | 线条端点样式 | `strokeCap="round"` - 圆头<br>`strokeCap="butt"` - 平头<br>`strokeCap="square"` - 方头 |
| strokeJoin | "bevel" \| "miter" \| "round" | "miter" | 线条连接点样式 | `strokeJoin="round"` - 圆角连接<br>`strokeJoin="miter"` - 尖角连接<br>`strokeJoin="bevel"` - 斜角连接 |
| strokeMiter | number | 4 | 尖角连接的限制比例 | `strokeMiter={8}` |
| opacity | number | 1 | 透明度 (0-1) | `opacity={0.5}` - 半透明<br>`opacity={1}` - 不透明 |
| blendMode | BlendMode | "srcOver" | 颜色混合模式 | `blendMode="multiply"`<br>`blendMode="screen"`<br>`blendMode="overlay"` |
| antiAlias | boolean | true | 抗锯齿 | `antiAlias={true}` - 平滑边缘<br>`antiAlias={false}` - 锐利边缘 |

#### 3.2.1 高级效果（作为子组件）
| 类别 | 主要组件 | 核心用途 |
|------|----------|----------|
| Shaders | `LinearGradient`<br>`RadialGradient`<br>`SweepGradient`<br>`TwoPointConicalGradient` | 颜色渐变效果<br>线性、径向、扫描、锥形渐变 |
| Image Filters | `Blur`<br>`Offset`<br>`DisplacementMap`<br>`Morphology` | 图像处理滤镜<br>模糊、位移、变形、形态学 |
| Color Filters | `MatrixColorFilter`<br>`BlendColorFilter`<br>`LumaColorFilter`<br>`LinearToSRGBGamma` | 颜色调整滤镜<br>矩阵变换、混合、灰度、色彩空间 |
| Mask Filters | `BlurMaskFilter` | 遮罩模糊效果<br>内外发光、投影效果 |
| Path Effects | `CornerPathEffect`<br>`DashPathEffect`<br>`DiscretePathEffect`<br>`SumPathEffect` | 路径样式效果<br>圆角、虚线、离散、组合效果 |

### 3.3 特征 - TODO 无法根据官网复现

<Paint />可以作为子组件传入, 用来做描边 stroke
---- 按照 官网,可以做填充 fill, 但是我没有复现出来

```tsx
import {Canvas, Circle, Paint, vec} from "@shopify/react-native-skia";

const width = 256;
const height = 256;

export const PaintDemo = () => {
  const strokeWidth = 10;
  const c = vec(width / 2, height / 2);
  const r = (width - strokeWidth) / 2;
  return (
    <Canvas style={{ width, height}}>
       <Circle c={c} r={r} color='red'>
        <Paint color="yellow" />
        <Paint color="green" style="stroke" strokeWidth={strokeWidth} />
        <Paint color="blue" style="stroke" strokeWidth={strokeWidth / 2} />
      </Circle>
    </Canvas>
  );
};
```

![alt text](paint1.png)

### 3.4 手动分配paint

```tsx
import {Canvas, Circle, Paint, Skia} from "@shopify/react-native-skia";
const width = 256;
const height = 256;
const r = width / 2;
const paint = Skia.Paint();
paint.setColor(Skia.Color("orange"));

export const PaintDemo = () => {
  return (
    <Canvas style={{flex: 1}}>
      <Circle cx={50} cy={50} r={30}  paint={paint}/>
    </Canvas>
  );
};
```

## 4. Group 

### 4.1 Group 组件四大功能概览

| 功能 | 作用 | 核心用途 |
|------|------|----------|
| Paint 属性继承 | 样式批量应用 | 统一管理颜色、描边等样式 |
| Transform 变换 | 图形变换操作 | 旋转、缩放、倾斜等 |
| Clip 裁剪 | 区域显示控制 | 圆形、矩形、自定义形状裁剪 |
| Layer 图层效果 | 位图特效 | 模糊、颜色矩阵等高级效果 |
| origin? | 原点 | 设置旋转变化的原点,原点不被继承 |

### 4.1.1 Paint 属性继承
可以批量管理样式 --- 样式可继承.
```tsx
<Group color="lightblue" style="stroke" strokeWidth={10}>
  <Circle cx={100} cy={100} r={50} />      {/* 继承浅蓝色描边 */}
  <Circle cx={200} cy={100} r={50} />      {/* 继承浅蓝色描边 */}
  <Circle cx={150} cy={200} r={50} color="red" />  {/* 覆盖为红色 */}
</Group>
```

### 4.1.2 Transform 变换

// 基础变换 --- 默认变换原点在左上角
```tsx
<Group transform={[{ rotate: Math.PI / 4 }]}>  {/* 旋转45度 */}
  <Rect x={50} y={50} width={100} height={100} />
</Group>
```

// 变换原点控制
```tsx
<Group 
  origin={{ x: 100, y: 100 }}  // 设置旋转中心
  transform={[{ rotate: Math.PI / 4 }]}
>
  <Rect x={50} y={50} width={100} height={100} />
</Group>
```

### 4.1.3 Clip 裁剪

**矩形裁剪**
```tsx
<Group clip={rect(50, 50, 100, 100)}>  {/* 只显示这个矩形区域 */}
  <Image ... />  {/* 图片只显示裁剪区域部分 */}
</Group>
```

**圆角矩形裁剪**
```tsx
<Group clip={rrect(rect(50, 50, 100, 100), 20, 20)}>  {/* 圆角裁剪 */}
  <Image ... />
</Group>
```

**路径裁剪**
```tsx
<Group clip={starPath}>  {/* 自定义星形路径裁剪 */}
  <Image ... />
</Group>
```

**反向裁剪**
```tsx
<Group clip={starPath} invertClip>  {/* 显示裁剪区域外的部分 */}
  <Image ... />
</Group>
```

### 4.1.4 Layer 图层效果 ✨

**位图特效**
> 对整个组应用统一特效（模糊、颜色调整等）

```tsx
<Group
  layer={
    <Paint>
      <Blur blur={20} />  {/* 模糊效果 */}
      <ColorMatrix matrix={[...]} />  {/* 颜色矩阵 */}
    </Paint>
  }
>
  <Circle ... />
  <Circle ... />
</Group>
```

### FitBox 自动适配

**自动缩放图形**

```tsx
<FitBox 
  src={rect(0, 0, 664, 308)}   // 原始尺寸
  dst={rect(0, 0, 256, 256)}   // 目标尺寸
>
  <Path ... />  {/* 自动缩放适配 */}
</FitBox>

```

## 5. Shapes

### 5.1 Polygons

**组件概览**


#### 5.1.1 Rect - 矩形

**属性说明**
属性	类型	必需	描述
x	number	✅	左上角X坐标
y	number	✅	左上角Y坐标
width	number	✅	矩形宽度
height	number	✅	矩形高度

**基础用法**
```tsx
import { Canvas, Rect } from "@shopify/react-native-skia";

const RectDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256} color="lightblue" />
    </Canvas>
  );
};
```

#### 5.1.2 RoundedRect - 圆角矩形

**属性说明**
属性	类型	必需	描述
x	number	✅	左上角X坐标
y	number	✅	左上角Y坐标
width	number	✅	矩形宽度
height	number	✅	矩形高度
r	number | Vector	❌	圆角半径

**基础用法**
```tsx
import { Canvas, RoundedRect } from "@shopify/react-native-skia";

const RoundedRectDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <RoundedRect
        x={0}
        y={0}
        width={256}
        height={256}
        r={25}
        color="lightblue"
      />
    </Canvas>
  );
};
```

**自定义各角圆角**
```tsx
import { Canvas, RoundedRect } from "@shopify/react-native-skia";

const CustomRoundedRect = () => {
  const size = 256;
  const r = size * 0.2;
  const rrct = {
    rect: { x: 0, y: 0, width: size, height: size },
    topLeft: { x: 0, y: 0 },        // 左上角：直角
    topRight: { x: r, y: r },       // 右上角：圆角
    bottomRight: { x: 0, y: 0 },    // 右下角：直角
    bottomLeft: { x: r, y: r },     // 左下角：圆角
  };
  
  return (
    <Canvas style={{ width: size, height: size }}>
      <RoundedRect rect={rrct} color="lightblue" />
    </Canvas>
  );
};
```

#### 5.1.3 DiffRect - 差异矩形

**属性说明**
属性	类型	必需	描述
outer	RectOrRRect	✅	外部矩形
inner	RectOrRRect	✅	内部矩形

**基础用法**
```tsx
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";

const DiffRectDemo = () => {
  const outer = rrect(rect(0, 0, 256, 256), 25, 25);
  const inner = rrect(rect(50, 50, 256 - 100, 256 - 100), 50, 50);
  
  return (
    <Canvas style={{ flex: 1 }}>
      <DiffRect inner={inner} outer={outer} color="lightblue" />
    </Canvas>
  );
};
```

#### 5.1.4 Line - 线条

**属性说明**
属性	类型	必需	描述
p1	Point	✅	起点坐标
p2	Point	✅	终点坐标

**基础用法**
```tsx
import { Canvas, Line, vec } from "@shopify/react-native-skia";

const LineDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Line
        p1={vec(0, 0)}
        p2={vec(256, 256)}
        color="lightblue"
        style="stroke"
        strokeWidth={4}
      />
    </Canvas>
  );
};
```

#### 5.1.5 Points - 点集合

**属性说明**
属性	类型	必需	描述
points	Point[]	✅	点坐标数组
mode	PointMode	❌	连接模式：points | lines | polygon

**连接模式说明**
模式	效果	描述
points	散点	只显示点，不连接
lines	连线	每两个点连接成线
polygon	多边形	连接所有点形成封闭图形


**基础用法**
```tsx
import { Canvas, Points, vec } from "@shopify/react-native-skia";

const PointsDemo = () => {
  const points = [
    vec(128, 0),
    vec(168, 80),
    vec(256, 93),
    vec(192, 155),
    vec(207, 244),
    vec(128, 202),
    vec(49, 244),
    vec(64, 155),
    vec(0, 93),
    vec(88, 80),
    vec(128, 0),  // 闭合点
  ];
  
  return (
    <Canvas style={{ flex: 1 }}>
      <Points
        points={points}
        mode="polygon"
        color="lightblue"
        style="stroke"
        strokeWidth={4}
      />
    </Canvas>
  );
};
```
