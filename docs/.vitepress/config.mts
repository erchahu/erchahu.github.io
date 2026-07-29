import { defineConfigWithTheme } from 'vitepress'
import fxConfig from "@fuxishi/vitepress-theme/config"
import type { FxThemeConfig } from "@fuxishi/vitepress-theme/config"

// https://vitepress.dev/reference/site-config
const defaultConfig = {
  title: "贰茶のBlog ~ Coding everywhere",
  description: "Welcome to Recho's Blog",
  extends: fxConfig,
  head: [['link', { rel: 'icon', href: '/logo.jpg' }]],
  themeConfig: {
    logo: '/logo.jpg',
    // https://vitepress.dev/reference/default-theme-config

    // 站点标题（可选，默认使用 title）
    // siteTitle: '贰茶のBlog',

    // 导航菜单
    nav: [
      { text: "Home", link: "/" },
      { text: "Tools And Skills", link: "/nav/tools" },
      { text: "Projects", link: "/nav/projects" },
      { text: "Profile", link: "/nav/profile" },
    ],

    // 侧边栏配置（根据你的内容结构调整）
    // sidebar: {
    //   '/': [
    //     {
    //       text: '指南',
    //       items: [
    //         { text: '首页', link: '/' },
    //         { text: '工具与技能', link: '/nav/tools' },
    //         { text: '项目', link: '/nav/projects' },
    //         { text: '个人简介', link: '/nav/profile' },
    //       ]
    //     }
    //   ]
    // },

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/your-username" }, // 替换为你的 GitHub
      // { icon: "twitter", link: "https://twitter.com/your-username" },
      // { icon: "discord", link: "https://discord.gg/your-invite" },
    ],

    // 页脚配置
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Sera.Hu'
    },

    // 编辑链接（可选）
    editLink: {
      pattern: 'https://github.com/your-username/your-repo/edit/main/docs/:path',
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

    // 页面导航文本
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置（右侧目录）
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: '页面导航'
    },

    // 外部链接图标
    externalLinkIcon: true,

    // 移动端菜单标签
    menuLabel: '菜单',
    returnToTopLabel: '返回顶部'
  }
};

export default defineConfigWithTheme<FxThemeConfig>(defaultConfig)
