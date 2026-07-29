---
outline: deep
---

# Create Vitepress Blog

## 安装
### [Prerequisites]前提条件
- [Node.js](https://nodejs.org/zh-cn) 22 及以上版本
- 了解 [Markdown](https://en.wikipedia.org/wiki/Markdown) 基本语法

### [Create]新建仓库

> 新建项目文件夹
```bash
mkdir blog
cd blog
```

> 安装VitePress，VitePress 可以单独使用，也可以安装到现有项目中。

```bash
yarn add -D vitepress@next vue
npm add -D vitepress@next
pnpm add -D vitepress@next
bun add -D vitepress@next
```

> 安装向导 · 以 `yarn` 举例
vitePress 附带一个命令行设置向导，安装后，通过运行以下命令启动向导：
```bash
yarn vitepress init
```

> 需要回答几个简单的问题：
![FAQ](image.png)

> 项目启动: `yarn run dev`, 启动效果
![start](image-1.png)

---
关于本地部署:
打包命令: `yarn build`
打包后预览: `yarn preview`

### [Theme]使用Theme · 以 fuxishi-vitepress-theme 为例
**安装**
```bash
yarn add @fuxishi/vitepress-theme
yarn add vitepress
```
**注册主题**
创建或修改 `.vitepress/theme/index.ts`
```ts
import FxTheme from "@fuxishi/vitepress-theme"
import "@fuxishi/vitepress-theme/style.css"

export default FxTheme
```
**继承配置**
创建或修改 `.vitepress/config.mts`：
```ts
import { defineConfigWithTheme } from "vitepress"
import fxConfig from "@fuxishi/vitepress-theme/config"
import type { FxThemeConfig } from "@fuxishi/vitepress-theme/config"

const defaultConfig = {
  title: "Recho Me",
  description: "a vitepress static site page",
  extends: fxConfig,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
};

export default defineConfigWithTheme<FxThemeConfig>(defaultConfig)

```
![theme](image-2.png)

#### Theme list
- [fuxishi-vitepress-theme](https://fuxishi-vitepress-theme.fuxizjxzy.cn/)

### [页面配置]

修改`.vitepress/config.mts`中的 `defaultConfig`:



## 参考链接
[VitePress](https://vitepress.dev/)
[fuxishi-vitepress-theme](https://fuxishi-vitepress-theme.fuxizjxzy.cn/)