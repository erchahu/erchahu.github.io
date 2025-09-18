---
title: React Native 添加多语言
date: 2025-09-18 20:32:14
tags:
- react-native
---

## 1. 安装依赖
```bash
npm install i18next react-i18next
# 或者使用 yarn
yarn add i18next react-i18next
```

## 2. 项目结构
![project](project.png)

```file
src/
  locale/
    index.ts          # i18n 配置和初始化
    resources/
      en.ts        # 英语翻译
      zh.ts        # 中文翻译
      index.ts
      # 其他语言...
```

## 3. 配置 i18n

在 `src/locale/index.ts` 中配置国际化：

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as resources from './resources';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: resources.en },
            zh: { translation: resources.zh },
        },
        lng: 'en',
        fallbackLng: 'en', // 如果当前语言不存在，回退到英文
        interpolation: {
            escapeValue: false, // 不转义 HTML 特殊字符
        },
    });

export default i18n;

```

## 4. 添加语言资源文件

### 4.1 src/locale/resources/index.ts
在 `src/locale/resources/index.ts` 中配置国际化：

```ts
export { default as en } from './en';
export { default as zh } from './zh';
```

### 4.2 src/locale/resources/en.ts

在 `src/locale/resources/en.ts` 中配置国际化：

```ts
export default {
    getStarted: {
      continue: 'Continue',
      start: 'Get Start'
    },
  }

```

### 4.3 src/locale/resources/zh.ts

在 `src/locale/resources/zh.ts` 中配置国际化：

```ts
export default {
    getStarted: {
      continue: '继续',
      start: '开始使用'
    },
  }

```

### 4.3 src/app.ts

```ts
import './locale';
```

## 5. 如何使用

### 5.1 使用 Hooks (函数组件)
```ts
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Text>{t('home.description')}</Text>
    </View>
  );
};

export default HomeScreen;
```

### 5.2 使用 HOC (类组件)
```ts
import React from 'react';
import { View, Text } from 'react-native';
import { withTranslation } from 'react-i18next';

class SettingsScreen extends React.Component {
  render() {
    const { t } = this.props;
    
    return (
      <View>
        <Text>{t('settings.title')}</Text>
        <Text>{t('settings.language')}</Text>
      </View>
    );
  }
}

export default withTranslation()(SettingsScreen);
```

### 5.3 处理语言切换

```ts
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <View style={{ flexDirection: 'row' }}>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => i18n.changeLanguage(lang.code)}
          style={{
            marginHorizontal: 5,
            padding: 5,
            backgroundColor: i18n.language === lang.code ? '#ddd' : '#fff'
          }}
        >
          <Text>{lang.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LanguageSelector;
```

### 5.4 处理复数形式(TODO)和插值

```ts
{
  "item_count": "{{count}} item",
  "item_count_plural": "{{count}} items",
  "welcome_message": "Hello, {{name}}!"
}
```

```ts
// 在组件中使用
const { t } = useTranslation();

// 复数形式
t('item_count', { count: 1 }); // "1 item"
t('item_count', { count: 5 }); // "5 items"

// 插值
t('welcome_message', { name: 'John' }); // "Hello, John!"
```