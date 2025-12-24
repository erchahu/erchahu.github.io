---
title: 如何在react中使用SVG
date: 2025-12-24 10:00:41
tags:
- react
---

## 方案一：作为 img 图标使用（简单但有限制）
```tsx
import logoIcon from 'your_path.svg';

function App() {
  return <img src={logoIcon} alt="Logo" width={50} height={50} />;
}
```

缺点: 不能修改颜色和样式等属性


## 方案二: 作为 React 组件使用
### 配置步骤
1. 安装依赖：
**vite**
```bash
yarn add -D vite-plugin-svgr
```

2 配置`vite.config.ts`
```diff
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
+ import svgr from 'vite-plugin-svgr'

export default defineConfig({
-  plugins: [react()],
+  plugins: [react(), svgr({ svgrOptions: { icon: true } })],
})

```

3. 添加 TypeScript 类型声明：
```d.ts
// vite-env.d.ts
/// <reference types="vite-plugin-svgr/client" />
```

### 使用方法
#### 方式一：直接导入使用
```tsx
import { ReactComponent as Logo } from './logo.svg';

function App() {
  return <Logo className="icon" width={50} height={50} fill="currentColor" />;
}
```
#### 方式二：封装通用 Icon 组件
```tsx
// components/SvgIcon/index.tsx
import React, { memo } from 'react';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

const SvgIcon = memo(({ 
  name, 
  size = 24, 
  color, 
  className = "" 
}: IconProps) => {
  const Icon = React.lazy(() => 
    import(`../../assets/icons/${name}.svg`)
  );

  return (
    <React.Suspense fallback={<div style={{ width: size, height: size }} />}>
      <Icon 
        width={size} 
        height={size} 
        fill={color || "currentColor"} 
        className={className}
      />
    </React.Suspense>
  );
});

export default SvgIcon;

// 使用
<SvgIcon name="home" size={32} color="#1890ff" />
```
#### 方式三：使用 Ant Design Icon 包装器（如果你的项目用了 Antd）

```tsx
import { Icon } from 'antd';
import { ReactComponent as CustomIcon } from './custom.svg';

function App() {
  return <Icon component={CustomIcon} style={{ fontSize: 24, color: 'red' }} />;
}
```

## 方案三：动态加载 SVG（修改你的原始代码）

```tsx
import React, { memo, useEffect, useState } from "react";

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  loading?: React.ReactNode;
}

const SvgIcon = memo(({ 
  name, 
  size = 24, 
  color, 
  className = "", 
  loading = <div style={{ width: size, height: size }} /> 
}: IconProps) => {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    // 动态导入 SVG 文件
    import(`../../../assets/images/files/${name}.svg?raw`)
      .then((module) => {
        let svgText = module.default;

        // 修改 SVG 属性
        if (color) {
          // 精确的替换属性
          svgText = svgText
            .replace(/(fill|stroke)="[^"]*"/g, (match, attr) => {
              // 保留 none 或空值
              if (match.includes('none') || match.includes('""')) {
                return match;
              }
              return `${attr}="${color}"`;
            });
        }

        // 设置尺寸
        svgText = svgText
          .replace(/width="[^"]*"/, `width="${size}"`)
          .replace(/height="[^"]*"/, `height="${size}"`)
          .replace(/<svg([^>]*)>/, `<svg$1 class="${className}">`);

        setSvgContent(svgText);
      })
      .catch((error) => {
        console.error("加载 SVG 失败:", error);
      });
  }, [name, color, size, className]);

  if (!svgContent) {
    return <>{loading}</>;
  }

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        display: "inline-block",
        lineHeight: 0 // 避免额外空白
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
});

export default SvgIcon;

```