---
title: 实现图片绕中心匀速旋转
date: 2025-09-18 21:03:51
tags:
- react-natiev
---

## 1. 技术实现

### 效果
![video](video.gif)

### 1.1 核心技术

- **React Native Animated API**：使用 React Native 的 Animated 库创建流畅的动画效果
- **数学计算**：使用三角函数计算旋转位置
- **React Hooks**：使用 useEffect 和 useRef 管理动画状态

### 1.2 关键组件
#### 1.2.1 旋转 组件
```tsx
const Item = memo(({ icon, angle, distance, duration = 10000, delay = 0 }:SkillItemProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        delay: delay,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim, duration, delay]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${angle}deg`, `${angle + 360}deg`],
  });
  
  // Calculate position based on angle and distance
  const x = Math.cos(angle * Math.PI / 180) * distance;
  const y = Math.sin(angle * Math.PI / 180) * distance;
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [{ rotate }, { translateX: x }, { translateY: y }],
      }}
    >
      <SkillItemWrap>
        <SkillItemImage source={images[icon]} />
      </SkillItemWrap>
    </Animated.View>
  )
})
```

#### 1.2.2 解析
1. **动画初始化**
   ```tsx
   const rotateAnim = useRef(new Animated.Value(0)).current;
   ```
   使用 `useRef` 和 `Animated.Value` 创建动画值，初始值为 0。

2. **动画配置**
   ```tsx
   useEffect(() => {
     Animated.loop(
       Animated.timing(rotateAnim, {
         toValue: 1,
         duration: duration,
         easing: Easing.linear,
         delay: delay,
         useNativeDriver: true,
       })
     ).start();
   }, [rotateAnim, duration, delay]);
   ```
   - 使用 `Animated.loop` 创建循环动画
   - `Animated.timing` 定义动画从 0 到 1 的过渡
   - `duration` 控制一次完整旋转的时间（默认 10000ms）
   - `Easing.linear` 确保匀速旋转
   - `delay` 控制动画开始的延迟时间
   - `useNativeDriver: true` 使用原生动画驱动提高性能

3. **角度插值**
   ```tsx
   const rotate = rotateAnim.interpolate({
     inputRange: [0, 1],
     outputRange: [`${angle}deg`, `${angle + 360}deg`],
   });
   ```
   将 0-1 的动画值映射到从初始角度到初始角度+360度的旋转角度。

4. **位置计算**
   ```tsx
   const x = Math.cos(angle * Math.PI / 180) * distance;
   const y = Math.sin(angle * Math.PI / 180) * distance;
   ```
   使用三角函数计算每个 Item 相对于中心点的 x 和 y 坐标：
   - `Math.cos(angle * Math.PI / 180)` 计算 x 轴上的相对位置
   - `Math.sin(angle * Math.PI / 180)` 计算 y 轴上的相对位置
   - `distance` 控制 Item 到中心点的距离

5. **应用变换**
   ```tsx
   <Animated.View
     style={{
       position: 'absolute',
       transform: [{ rotate }, { translateX: x }, { translateY: y }],
     }}
   >
   ```
   使用 `transform` 属性应用旋转和位移变换：
   - `rotate` 控制旋转角度
   - `translateX` 和 `translateY` 控制位置偏移

## 2. 使用方法

在 LogoContent 组件中，我们创建了 6 个不同角度的 SkillItem，围绕中心的地球 emoji 旋转：

```tsx
const LogoContent = () => {
  return (
    <SkillsContentWrap>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 40 }}>🌏</Text>
        
        <Item icon="skill1" angle={0} distance={80} />
        <Item icon="skill2" angle={60} distance={80} delay={500} />
        <Item icon="skill3" angle={120} distance={80} delay={1000} />
        <Item icon="skill4" angle={180} distance={80} delay={1500} />
        <Item icon="skill5" angle={240} distance={80} delay={2000} />
        <Item icon="skill6" angle={300} distance={80} delay={2500} />
      </View>
    </SkillsContentWrap>
  )
}
```

- 每个 Item 的 `angle` 属性设置了它的初始角度（0°, 60°, 120°, 180°, 240°, 300°），均匀分布在圆周上
- `distance` 属性设置了到中心点的距离（80 单位）
- `delay` 属性设置了每个 Item 开始动画的延迟时间，形成错落有致的启动效果

## 3. 性能优化

1. **使用 memo**：组件使用 React.memo 减少不必要的重渲染
2. **useNativeDriver**：启用原生动画驱动提高性能
3. **适当的组件拆分**：将 Item 拆分为独立组件，优化渲染逻辑

## 4. MY TODO?

1. **交互响应**：可以添加触摸事件，使用户可以与旋转的 Item 交互