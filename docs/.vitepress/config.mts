import { defineConfigWithTheme } from "vitepress";
import fxConfig from "@fuxishi/vitepress-theme/config";
import type { FxThemeConfig } from "@fuxishi/vitepress-theme/config";
import { withSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config

const vitepressConfig = defineConfigWithTheme<FxThemeConfig>({
  title: "贰茶のBlog ~ Coding everywhere",
  description: "Welcome to Recho's Blog",
  extends: fxConfig,
  head: [["link", { rel: "icon", href: "favicon.ico" }]],
  // 站点挂载在 https://erchahu.github.io/blogs/；CI 会把产物嵌到 blogs/ 子目录再上传
  base: '/blogs/',
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      { text: "Home", link: "/" },
      { text: "Tools And Skills", link: "/nav/tools" },
      { text: "Projects", link: "/nav/projects" },
      { text: "Profile", link: "/nav/profile" },
    ],

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/erchahu" },
      { icon: "gitee", link: "https://gitee.com/r-echo" },
      // { icon: "twitter", link: "https://twitter.com/your-username" },
      // { icon: "discord", link: "https://discord.gg/your-invite" },
    ],

    // 页脚配置
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Sera.Hu",
    },

    // 编辑链接（可选）
    editLink: {
      pattern:
        "https://github.com/your-username/your-repo/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    // 最后更新
    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: "long",
        timeStyle: "short",
      },
    },

    // 页面导航文本
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 大纲配置（右侧目录）
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: "页面导航",
    },

    // 外部链接图标
    externalLinkIcon: true,

    returnToTopLabel: "返回顶部",
  },
});

export default withSidebar(
  vitepressConfig,
  [
    {
      documentRootPath: '/docs/research',
      scanStartPath: 'flutter',
      resolvePath: '/research/flutter/',
      useTitleFromFileHeading: true,
      collapsed: true,
    },
    {
      documentRootPath: '/docs/research',
      scanStartPath: 'algorithm',
      resolvePath: '/research/algorithm/',
      useTitleFromFrontmatter: true,
      collapsed: true,
    },
    // {
    //   documentRootPath: '/docs/research',
    //   scanStartPath: 'swift',
    //   resolvePath: '/research/swift/',
    //   useTitleFromFrontmatter: true,
    //   collapsed: true,
    // },
    {
      documentRootPath: '/docs/research',
      scanStartPath: 'blogs',
      resolvePath: '/research/blogs/',
      useTitleFromFrontmatter: true,
      useTitleFromFileHeading: true,
      collapsed: false,
    },
  ]
);
