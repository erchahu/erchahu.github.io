---
title: react-native-styled-components
date: 2026-01-26 18:19:20
tags:
  - react-native
  - styled-components
---

#  React Native 中 Styled Components 配置指南

## 什么是 Styled Components？

Styled Components 是一个 CSS-in-JS 库，让你可以在 JavaScript/TypeScript 代码中编写样式，并将样式与组件紧密结合。

### 核心特性

**1. CSS-in-JS**
```typescript
// 传统方式
const styles = StyleSheet.create({
  container: { padding: 16 }
});

// Styled Components 方式
const Container = styled.View`
  padding: 16px;
`;
```

**2. 自动样式隔离**
每个 styled component 都有唯一的 class 名，避免样式冲突：
```typescript
const Button = styled.TouchableOpacity`...`;
// 生成类似：.Button-asdf1234 { ... }
```

**3. 主题支持**
内置主题系统，轻松实现深色/浅色主题：
```typescript
const Title = styled.Text`
  color: ${props => props.theme.colors.text};
`;
```

**4. 动态样式**
基于 props 动态改变样式：
```typescript
const Button = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' }>`
  background-color: ${props =>
    props.variant === 'primary' ? '#007AFF' : '#5856D6'};
`;
```

### 优势对比

| 特性 | StyleSheet | Styled Components |
|------|-----------|-------------------|
| 样式隔离 | ❌ 需要手动管理 | ✅ 自动隔离 |
| 主题支持 | ❌ 需要额外配置 | ✅ 内置支持 |
| 动态样式 | ⚠️ 条件语句复杂 | ✅ 简洁直观 |
| TypeScript | ✅ 支持 | ✅ 完整类型推断 |
| 样式复用 | ⚠️ 需要手动合并 | ✅ 继承机制 |
| 组件封装 | ❌ 样式和组件分离 | ✅ 样式与组件一体 |

## 如何配置 Styled Components

### 第一步：安装依赖

```bash
# 安装 styled-components
yarn add styled-components

# 安装类型定义和 Babel 插件
yarn add -D @types/styled-components babel-plugin-styled-components
```

**依赖说明**：
- `styled-components`: 核心库
- `@types/styled-components`: TypeScript 类型定义
- `babel-plugin-styled-components`: 优化开发体验和性能

### 第二步：配置 Babel

编辑 `babel.config.js`：

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ... 其他插件
    [
      'babel-plugin-styled-components',
      {
        displayName: true,              // 开发模式下显示组件名
        meaninglessFileNames: ["index", "styles"],
        pure: true,                     // 移除不必要的辅助代码
      },
    ]
  ],
};
```

**配置说明**：
- `displayName: true` - 开发时在 React DevTools 中显示组件名称
- `meaninglessFileNames` - 忽略这些文件名，不生成 class 名
- `pure: true` - 启用 tree-shaking 优化

### 第三步：配置 TypeScript 类型

创建 `app/types/styled-components-native.d.ts`：

```typescript
import 'styled-components/native';

declare module 'styled-components/native' {
  // 主题模式类型
  type ThemeModeType = 'dark' | 'light';

  // 间距类型
  type SpacingType = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    screenPadding: number;
    cardPadding: number;
    inputPadding: number;
    negSm: number;
    negMd: number;
    negLg: number;
  };

  // 字体类型
  type FontSizeType = {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };

  type FontWeightType = {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };

  type TypographyType = {
    fontSize: FontSizeType;
    fontWeight: FontWeightType;
  };

  // 颜色类型
  type ColorsType = {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textWhite: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    overlay: string;
    transparent: string;
  };

  // 主题接口
  export interface DefaultTheme {
    mode: ThemeModeType;
    colors: ColorsType;
    spacing: SpacingType;
    typography: TypographyType;
  }
}
```

### 第四步：配置路径别名

更新 `babel.config.js` 和 `tsconfig.json` 中的别名配置：

**babel.config.js**：
```javascript
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          '@': './app',
          '@providers': './app/providers',
          // ... 其他别名
        },
      },
    ],
  ],
};
```

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@providers": ["app/providers"],
      "@providers/*": ["app/providers/*"]
    }
  }
}
```

### 第五步：创建主题系统

#### 1. 主题结构

创建以下文件结构：

```
app/styles/theme/
├── custom/
│   ├── spacing.ts      # 间距系统
│   └── typography.ts   # 字体系统
├── dark/
│   └── index.ts        # 深色主题颜色
├── light/
│   └── index.ts        # 浅色主题颜色
└── index.tsx           # 主题生成器
```

#### 2. 定义间距系统

`app/styles/theme/custom/spacing.ts`：
```typescript
export const spacing = {
  // 基础间距（4px 基准）
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // 特殊间距
  screenPadding: 16,
  cardPadding: 16,
  inputPadding: 12,

  // 负间距
  negSm: -8,
  negMd: -16,
  negLg: -24,
} as const;

export type Spacing = typeof spacing;
```

#### 3. 定义字体系统

`app/styles/theme/custom/typography.ts`：
```typescript
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export type Typography = typeof typography;
```

#### 4. 定义颜色

`app/styles/theme/light/index.ts`：
```typescript
import { ColorsType } from "styled-components/native";

const colors: ColorsType = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  textWhite: '#FFFFFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  border: '#C6C6C8',
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent'
};

export { colors };
```

`app/styles/theme/dark/index.ts`：
```typescript
import { ColorsType } from "styled-components/native";

const colors: ColorsType = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#121212',
  text: '#FFFFFF',
  textWhite: '#FFFFFF',
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  border: '#3A3A3C',
  overlay: 'rgba(0, 0, 0, 0.7)',
  transparent: 'transparent'
};

export { colors };
```

#### 5. 创建主题生成器

`app/styles/theme/index.tsx`：
```typescript
import { DefaultTheme, ThemeModeType } from 'styled-components/native';
import { colors as darkColor } from './dark';
import { colors as lightColor } from './light';
import { spacing } from './custom/spacing';
import { typography } from './custom/typography';

const getTheme: (type: ThemeModeType) => DefaultTheme = type => {
  const theme = type === 'dark' ? darkColor : lightColor;
  return {
    mode: type,
    spacing,
    typography,
    colors: theme,
  };
};

export { getTheme };
```

### 第六步：创建 ThemeProvider

`app/providers/ThemeProvider/index.tsx`：
```typescript
import { getTheme } from '@/styles';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  DefaultTheme,
  ThemeModeType,
  ThemeProvider as StyledThemeProvider,
} from 'styled-components/native';

// Context 类型定义
type ContextProps = {
  mode: ThemeModeType;
  theme: DefaultTheme;
  toggleTheme: () => void;
};

// 默认主题
const defaultTheme: ContextProps = {
  mode: 'light',
  theme: getTheme('light'),
  toggleTheme: () => {},
};

// 创建 Context
export const ThemeContext = createContext<ContextProps>(defaultTheme);

// ThemeProvider 组件
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [mode, setMode] = useState<ThemeModeType>(isDarkMode ? 'dark' : 'light');

  // 切换主题函数
  const toggleTheme = useCallback(() => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = getTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
```

`app/providers/index.ts`：
```typescript
export { ThemeContext, ThemeProvider } from './ThemeProvider';
```

### 第七步：导出样式系统

`app/styles/index.ts`：
```typescript
// 主题 Design Tokens
export * from './theme';

// 通用样式
export * from './common';
```

### 第八步：验证配置

创建一个测试组件 `app/index.tsx`：

```typescript
import styled from 'styled-components/native';
import { ThemeProvider, ThemeContext } from '@providers';
import { useContext } from 'react';

const Container = styled.View`
  padding: ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.background};
`;

const Title = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md}px;
  border-radius: 8px;
  margin-top: ${props => props.theme.spacing.md}px;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.textWhite};
  text-align: center;
`;

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { toggleTheme, mode } = useContext(ThemeContext);

  return (
    <Container>
      <Title>Styled Components 配置成功！</Title>
      <Title>当前主题: {mode}</Title>
      <Button onPress={toggleTheme}>
        <ButtonText>切换主题</ButtonText>
      </Button>
    </Container>
  );
}

export default App;
```

### 第九步：重新构建

配置完成后，必须重新构建应用：

```bash
# 清理缓存并重启
yarn start --reset-cache

# 或者重新构建
# iOS
yarn ios

# Android
yarn android
```

## 配置检查清单

- ✅ 安装了 `styled-components`
- ✅ 安装了 `@types/styled-components`
- ✅ 安装了 `babel-plugin-styled-components`
- ✅ 配置了 `babel.config.js`
- ✅ 创建了类型定义文件
- ✅ 配置了路径别名（`@providers`）
- ✅ 创建了主题文件结构
- ✅ 定义了间距系统
- ✅ 定义了字体系统
- ✅ 定义了颜色（深色/浅色）
- ✅ 创建了主题生成器
- ✅ 创建了 ThemeProvider
- ✅ 导出了样式系统
- ✅ 重新构建了应用

## 常见配置问题

### 1. TypeScript 类型错误

**问题**：`props.theme` 报类型错误

**解决**：
- 确保 `app/types/styled-components-native.d.ts` 文件存在
- 确保 `DefaultTheme` 接口定义了所有需要的字段
- 重启 TypeScript 服务器（VSCode 中 Cmd+Shift+P -> "Restart TS Server"）

### 2. 主题切换不生效

**问题**：点击切换主题，样式不变

**检查**：
1. 组件是否在 `ThemeProvider` 内部？
2. 是否使用了 `props.theme.colors.xxx` 而不是硬编码颜色值？
3. 是否重新构建了应用？

### 3. Babel 配置不生效

**解决**：
1. 清理缓存：`yarn start --reset-cache`
2. 检查 `babel.config.js` 语法
3. 重启 Metro bundler

### 4. 找不到模块 '@providers'

**解决**：
1. 检查 `babel.config.js` 和 `tsconfig.json` 别名配置
2. 确保路径正确：`'./app/providers'`
3. 重启 TS 服务器

## 参考资源

- [Styled Components 官方文档](https://styled-components.com/docs)
- [React Native 文档](https://reactnative.dev/docs/style)
- [TypeScript 类型定义](https://styled-components.com/docs/api#typescript)
