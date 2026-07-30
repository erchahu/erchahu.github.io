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
<img src="./image.png" alt="FAQ" width="50%">

> 项目启动: `yarn blog:dev`, 启动效果
<img src="./image-1.png" alt="start" width="50%">

---

### [页面配置]

参考文档：[默认主题配置](https://vitepress.dev/zh/reference/default-theme-config)

在 `themeConfig` 中可配置以下页面相关选项：

```ts
themeConfig: {
  // Logo（支持浅色/深色模式）
  logo: '/logo.jpg',
  // 或使用不同 logo：
  // logo: { light: '/logo-light.jpg', dark: '/logo-dark.jpg' }

  // 站点标题（覆盖默认 title）
  // siteTitle: '我的博客',

  // 导航菜单
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Dropdown', items: [
      { text: 'Item A', link: '/a' },
      { text: 'Item B', link: '/b' }
    ]}
  ],

  // 侧边栏
  sidebar: {
    '/': [
      {
        text: '指南',
        items: [
          { text: '首页', link: '/' },
          { text: '开始', link: '/guide/getting-started' }
        ]
      }
    ]
  },

  // 页脚
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2024-present Your Name'
  },

  // 编辑链接
  editLink: {
    pattern: 'https://github.com/username/repo/edit/main/docs/:path',
    text: '在 GitHub 上编辑此页'
  },

  // 最后更新
  lastUpdated: {
    text: '最后更新',
    formatOptions: {
      dateStyle: 'long',
      timeStyle: 'short'
    }
  },

  // 页面导航文本（上一页/下一页）
  docFooter: {
    prev: '上一页',
    next: '下一页'
  },

  // 大纲（右侧目录）
  outline: {
    level: [2, 3],  // 显示 h2 和 h3
    label: '页面导航'
  },

  // 外部链接图标
  externalLinkIcon: true,

  // 社交链接
  socialLinks: [
    { icon: 'github', link: 'https://github.com/your-username' },
    { icon: 'twitter', link: 'https://twitter.com/your-username' }
  ]
}
```

#### 在页面中覆盖配置

每个页面的 frontmatter 可以覆盖部分配置：

```yaml
---
outline: [2, 4]      # 只显示 h2 和 h4
outlineLabel: '目录'
lastUpdated: false   # 禁用最后更新
editLink: false      # 禁用编辑链接
---
```

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
<img src="./image-2.png" alt="theme" width="50%">



#### Theme list
- [fuxishi-vitepress-theme](https://fuxishi-vitepress-theme.fuxizjxzy.cn/)
- [vitepress-blogs-theme](https://chunge16.github.io/vitepress-blogs-theme/)
- [duxweb](https://duxweb.github.io/vitepress-theme)
- [catppuccin](https://vitepress.catppuccin.com/)
- [sugarat](https://theme.sugarat.top/en/)

### [自动侧边栏] vitepress-sidebar

[vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar) 可以自动根据文件结构生成侧边栏。

**安装**
```bash
npm install vitepress-sidebar
```

**使用**
```ts
import { withSidebar } from "vitepress-sidebar"

const config = defineConfig({ /* ... */ })

export default withSidebar(config, [
  {
    documentRootPath: '/docs',           // 文档根目录
    scanStartPath: 'research/blogs',     // 扫描起始路径
    resolvePath: '/research/blogs/',     // 解析路径
    useTitleFromFrontmatter: true,        // 从 frontmatter 获取标题
    useTitleFromFileHeading: true,        // 从文件标题获取
    collapsed: false,                     // 是否默认折叠
  },
])
```

**配置选项**
| 选项 | 说明 |
|------|------|
| `documentRootPath` | 文档根目录路径 |
| `scanStartPath` | 从哪个目录开始扫描 |
| `resolvePath` | URL 解析路径 |
| `useTitleFromFrontmatter` | 从 frontmatter 的 `title` 获取标题 |
| `useTitleFromFileHeading` | 从文件的第一个 `#` 标题获取 |
| `collapsed` | 侧边栏组是否默认折叠 |

### [完整配置示例]

结合所有配置，完整的 `.vitepress/config.mts` 示例：

```ts
import { defineConfigWithTheme } from "vitepress"
import fxConfig from "@fuxishi/vitepress-theme/config"
import type { FxThemeConfig } from "@fuxishi/vitepress-theme/config"
import { withSidebar } from "vitepress-sidebar"

const vitepressConfig = defineConfigWithTheme<FxThemeConfig>({
  title: "贰茶のBlog ~ Coding everywhere",
  description: "Welcome to Recho's Blog",
  extends: fxConfig,
  head: [["link", { rel: "icon", href: "favicon.ico" }]],
  // GitHub Pages 子路径部署时需要设置 base，本地预览也会走该路径
  base: '/blogs/',
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      { text: "Home", link: "/" },
      { text: "Tools And Skills", link: "/nav/tools" },
      { text: "Projects", link: "/nav/projects" },
      { text: "Profile", link: "/nav/profile" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/your-username" },
      { icon: "gitee", link: "https://gitee.com/your-username" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Your Name",
    },

    editLink: {
      pattern: "https://github.com/your-username/your-repo/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    lastUpdated: {
      text: "最后更新",
      formatOptions: { dateStyle: "long", timeStyle: "short" },
    },

    docFooter: { prev: "上一页", next: "下一页" },
    outline: { level: [2, 3], label: "页面导航" },
    externalLinkIcon: true,
    returnToTopLabel: "返回顶部",
  },
})

export default withSidebar(vitepressConfig, [
  {
    documentRootPath: '/docs/research',
    scanStartPath: 'blogs',
    resolvePath: '/research/blogs/',
    useTitleFromFrontmatter: true,
    useTitleFromFileHeading: true,
    collapsed: false,
  },
])
```

## [Deploy] 部署

### 本地开发

在项目根目录的 `package.json` 中配置脚本：

```json
{
  "scripts": {
    "blog:dev": "vitepress dev docs --port 30112",
    "blog:build": "vitepress build docs",
    "blog:preview": "vitepress preview docs --port 30113"
  }
}
```

启动本地开发服务器（热更新）：

```bash
yarn blog:dev
# 或 npm run blog:dev
```

浏览器访问：`http://localhost:30112/blogs/`（因配置了 `base: '/blogs/'`，路径需带上 base）

### 本地打包与预览

> 本地「部署」指：先构建静态产物，再用预览服务模拟线上访问。

**1. 构建静态站点**

```bash
yarn blog:build
```

产物默认输出到 `docs/.vitepress/dist/`。

**2. 本地预览构建结果**

```bash
yarn blog:preview
```

浏览器访问：`http://localhost:30113/blogs/`

> `blog:dev` 适合日常写文档；`blog:build` + `blog:preview` 用于验证打包后的真实效果（含 base 路径、静态资源是否正确）。

### 静态资源（public）

VitePress 会把 `docs/public/` 下的文件原样复制到构建产物根目录。

建议目录结构：

```text
docs/
├── public/
│   ├── favicon.ico    # 站点图标
│   └── logo.jpg       # Logo（themeConfig.logo / 页面引用）
├── .vitepress/
│   └── config.mts
└── index.md
```

配置示例：

```ts
head: [["link", { rel: "icon", href: "favicon.ico" }]],
base: '/blogs/',
themeConfig: {
  logo: '/logo.jpg',
}
```

- `logo`、页面中的图片路径以 `/` 开头时，会相对于 `base` 解析（例如最终为 `/blogs/logo.jpg`）
- `favicon.ico`、`logo.jpg` 务必放在 `docs/public/`，不要放在 `docs/` 根目录，否则构建后可能无法访问

### base 路径说明

若站点部署在子路径（如 GitHub Pages：`https://username.github.io/blogs/`），需在配置中设置：

```ts
base: '/blogs/',
```

本地 `blog:dev` / `blog:preview` 也会使用该 base，因此访问地址都要带 `/blogs/` 前缀。若部署在域名根路径，将 `base` 改为 `'/'` 即可。

## 参考链接
[VitePress](https://vitepress.dev/)
[fuxishi-vitepress-theme](https://fuxishi-vitepress-theme.fuxizjxzy.cn/)

[vitepress-sidebar](https://github.com/jooy2/vitepress-sidebar)