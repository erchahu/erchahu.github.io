---
title: react-native-env
date: 2026-01-21 17:01:51
tags:
---

# 环境变量使用指南

## 什么是环境变量？

环境变量是在应用程序外部配置的动态值，用于存储不同环境（开发、测试、生产）下的配置信息，如 API 密钥、数据库连接字符串、第三方服务密钥等。

## 为什么要使用环境变量？

- ✅ **安全性**：敏感信息不会硬编码在代码中，避免泄露到版本控制系统
- ✅ **灵活性**：不同环境可以使用不同的配置，无需修改代码
- ✅ **可维护性**：集中管理配置，修改更方便
- ✅ **团队协作**：每个开发者可以使用自己的本地配置

## 项目配置方式

本项目使用 **react-native-config** 来管理环境变量，这是 React Native 生态中最流行的环境变量解决方案之一。

### 安装的依赖

```json
{
  "dependencies": {
    "react-native-config": "^1.6.1"
  }
}
```

### 类型定义

配置 TypeScript 类型定义，位于 `app/types/react-native-config.d.ts`：

```typescript
declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: string;
    AMPLITUDE_INIT_KEY: string;
  }

  export const Config: NativeConfig
  export default Config
}
```

## 快速开始

### 1. 创建本地环境变量文件

项目根目录下已有 `.env.sample` 模板文件，复制它并填入真实的配置：

```bash
# 复制模板文件
cp .env.sample .env
```

### 2. 编辑 .env 文件

```env
# Environment (development, staging, production)
ENV=development

# Amplitude Analytics
AMPLITUDE_INIT_KEY=your_amplitude_init_key_here
```

> ⚠️ **重要**：`.env` 文件已被 `.gitignore` 忽略，不会被提交到版本控制系统，可以安全地存储敏感信息。

### 3. 重新构建应用

**重要**：修改环境变量后，必须重新构建应用才能生效：

```bash
# iOS
npm run ios

# Android
npm run android
```

## 平台差异说明

### Android

自动读取项目根目录的 `.env` 文件，无需额外配置。

已在 `android/app/build.gradle` 中配置：

```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

### iOS

已通过 CocoaPods 集成，自动读取项目根目录的 `.env` 文件。

如果遇到问题，执行：
```bash
cd ios && pod install
```

## 如何使用环境变量

### 在 JavaScript/TypeScript 代码中导入

```typescript
import Config from 'react-native-config';

// 读取环境变量
const currentEnv = Config.ENV; // 'development' | 'staging' | 'production'
const amplitudeKey = Config.AMPLITUDE_INIT_KEY;

// 示例：根据环境执行不同逻辑
if (currentEnv === 'production') {
  // 生产环境逻辑
} else {
  // 开发/测试环境逻辑
}
```

### 实际使用示例

```typescript
// app/utils/event.ts
import Config from 'react-native-config';
import { init } from '@amplitude/analytics-react-native';

const AMPLITUDE_KEY = Config.AMPLITUDE_INIT_KEY;

export const initAmplitude = () => {
  if (!AMPLITUDE_KEY) {
    console.warn('AMPLITUDE_INIT_KEY is not configured');
    return;
  }

  init(AMPLITUDE_KEY);
};
```

## 切换环境

### 方法 1：手动修改 .env

直接编辑 `.env` 文件，修改 `ENV` 变量：

```env
ENV=staging
AMPLITUDE_INIT_KEY=staging_key_here
```

### 方法 2：创建切换脚本（可选）

创建 `scripts/switch-env.sh`：

```bash
#!/bin/bash
cp .env.$1 .env
echo "Switched to $1 environment"
```

使用：
```bash
chmod +x scripts/switch-env.sh
./scripts/switch-env.sh staging
```

## 当前项目的环境变量

| 变量名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `ENV` | string | 当前运行环境 | `development`, `staging`, `production` |
| `AMPLITUDE_INIT_KEY` | string | Amplitude 分析平台的初始化密钥 | `***` |

## 添加新的环境变量

### 步骤 1：在 .env 中添加

```env
NEW_VARIABLE=your_value_here
```

### 步骤 2：更新 TypeScript 类型定义

在 `app/types/react-native-config.d.ts` 中添加：

```typescript
declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: string;
    AMPLITUDE_INIT_KEY: string;
    NEW_VARIABLE: string;  // 新增
  }
  // ...
}
```

### 步骤 3：在代码中使用

```typescript
import Config from 'react-native-config';
const newVar = Config.NEW_VARIABLE;
```

### 步骤 4：更新 .env.sample（可选但推荐）

将新的环境变量（非敏感的）添加到 `.env.sample` 作为示例：

```env
NEW_VARIABLE=example_value_here
```

### 步骤 5：重新构建应用

```bash
npm run ios
# 或
npm run android
```

## 安全注意事项

### .gitignore 配置

以下文件已被忽略，不会提交到 git：

- `.env` - 本地环境变量（含敏感信息）
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`

以下文件会提交到 git（不含敏感信息）：

- `.env.sample` - 环境变量模板
- `docs/ENV_GUIDE.md` - 使用文档

### 环境变量命名规范

- ✅ 使用大写字母和下划线：`API_BASE_URL`
- ✅ 使用描述性的名称：`AMPLITUDE_INIT_KEY`
- ✅ 按功能分组（用注释分隔）

示例：
```env
# Environment
ENV=development

# Analytics
AMPLITUDE_INIT_KEY=your_key_here

# API
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_BETA_FEATURES=false
SHOW_DEBUG_INFO=true
```

## 常见问题

### 1. 修改环境变量后不生效？

**原因**：环境变量在构建时被读取，热更新不会刷新。

**解决方法**：重新构建应用
```bash
# iOS
npm run ios

# Android
npm run android
```

### 2. TypeScript 报错：属性不存在？

**解决方法**：更新 `app/types/react-native-config.d.ts` 中的类型定义

### 3. iOS 中环境变量读取不到？

**解决方法**：
1. 确保已执行 `cd ios && pod install`
2. 清理构建缓存：Product -> Clean Build Folder (⇧⌘K)
3. 重新构建应用

### 4. Android 中环境变量读取不到？

**解决方法**：
1. 清理构建：`cd android && ./gradlew clean`
2. 重新构建应用

### 5. 为什么不用 .env.development 等多文件？

**原因**：
- iOS 和 Android 的加载行为不一致，容易导致混淆
- 管理多个文件增加复杂度
- 只用 `.env` + 手动切换更简单直接

**替代方案**：
- 使用 `.env` + 切换脚本
- 未来可以集成 AWS SSM 等远程配置服务

## 新同事入职指南

1. **复制模板文件**
   ```bash
   cp .env.sample .env
   ```

2. **填入真实配置**
   - 从团队负责人获取各个环境的密钥
   - 编辑 `.env` 填入真实值

3. **重新构建应用**
   ```bash
   npm run ios
   # 或
   npm run android
   ```

4. **验证配置**
   ```typescript
   import Config from 'react-native-config';
   console.log(Config.ENV);  // 应该输出当前环境
   console.log(Config.AMPLITUDE_INIT_KEY);  // 应该输出真实的 key
   ```

## 参考资源

- [react-native-config 官方文档](https://github.com/luggit/react-native-config)
- [React Native 环境变量最佳实践](https://reactnative.dev/docs/environmentvariables)
