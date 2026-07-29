import { defineConfigWithTheme } from 'vitepress'
import fxConfig from "@fuxishi/vitepress-theme/config"
import type { FxThemeConfig } from "@fuxishi/vitepress-theme/config"

// https://vitepress.dev/reference/site-config
const defaultConfig = {
  extends: fxConfig,
  title: "Recho Me",
  description: "a vitepress static site page",
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
