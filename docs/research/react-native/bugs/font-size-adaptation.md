---
outline: deep
---

# React Native 应用字体大小适配

> 避免因系统字体缩放导致 UI 异常（布局撑破、文字截断、按钮错位等）。

## 问题现象

用户在系统设置里调大「显示大小 / 字体大小」后，RN 应用内文字会跟着放大，常见问题：

- 固定高度的卡片、按钮被文字撑破
- 单行文案溢出截断或换行错乱
- 列表 item 高度不一致、错位重叠

根因：RN 的 `Text` / `TextInput` **默认开启字体缩放**（`allowFontScaling = true`），会跟随系统无障碍字体倍率变化。

## 方案一：限制最大缩放倍率

不想完全禁用无障碍能力时，可限制最大倍率，兼顾可用性与布局稳定性：

```tsx
<Text maxFontSizeMultiplier={1.2} style={{ fontSize: 14 }}>
  标题文案
</Text>

<TextInput maxFontSizeMultiplier={1.2} />
```

## 方案二：单组件按需控制

个别页面需要跟随系统字体时，局部打开即可：

```tsx
<Text allowFontScaling style={{ fontSize: 16 }}>
  可跟随系统缩放
</Text>
```

### 涉及到的属性

适用于 `Text` / `TextInput`：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `allowFontScaling` | `boolean` | `true` | 是否允许文字随系统字体大小缩放。设为 `false` 后，`fontSize` 按字面值渲染，不受系统倍率影响 |
| `maxFontSizeMultiplier` | `number` | 无上限 | 允许的最大字体缩放倍率。例如 `1.2` 表示最多放大到原字号的 1.2 倍；设为 `0` / `1` 等同于禁止放大 |

> `allowFontScaling={false}` 时，`maxFontSizeMultiplier` 不再生效。需要保留一定无障碍能力时，优先用 `maxFontSizeMultiplier` 限幅，而不是直接关掉缩放。

## 方案三：按系统缩放分档切换字号

系统字体缩放通常落在 **0.8 ~ 2.0**。若直接跟随放大，布局容易失控；若完全关闭，又牺牲了可读性。

折中做法：关闭组件级自动缩放，读取当前 `fontScale`，按区间切换**整套字号 token**——适当放大，同时保留原有样式层级与布局逻辑。

| 缩放区间 | 字号方案 | 说明 |
| --- | --- | --- |
| `0.8 ~ 1.2` | 方案 A（基准） | 接近设计稿，正常使用 |
| `1.2 ~ 1.6` | 方案 B（中档） | 整体上调一档，间距/行高同步微调 |
| `1.6 ~ 2.0` | 方案 C（大档） | 再上调一档，优先保证可读性 |

示意：

```ts
import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale(); // 常见范围约 0.8 ~ 2.0

type FontTier = 'A' | 'B' | 'C';

function getFontTier(scale: number): FontTier {
  if (scale < 1.2) return 'A';
  if (scale < 1.6) return 'B';
  return 'C';
}

// 三套字号 token，保持 title / body / caption 层级关系
const fontTokens = {
  A: { title: 18, body: 14, caption: 12 },
  B: { title: 20, body: 16, caption: 13 },
  C: { title: 22, body: 18, caption: 14 },
} as const;

const fonts = fontTokens[getFontTier(fontScale)];
```

使用时配合 `allowFontScaling={false}`，由业务字号方案接管缩放，避免系统倍率再叠一层：

```tsx
<Text allowFontScaling={false} style={{ fontSize: fonts.body }}>
  正文内容
</Text>
```

> 关键：分档只改字号不够时，中/大档可同步调整行高、内边距；避免只放大文字、容器高度仍写死。

## 实践建议

| 场景 | 建议 |
| --- | --- |
| 强视觉还原、复杂固定布局 | 全局 `allowFontScaling: false` |
| 需要基础无障碍支持 | 全局 `maxFontSizeMultiplier`（如 1.1 ~ 1.3） |
| 既要可读性又要保住样式层级 | 按 `fontScale` 分档切换字号方案（0.8~1.2 / 1.2~1.6 / 1.6~2.0） |
| 设置页、协议页等长文 | 局部允许缩放 |

## 验证方式

1. iOS：设置 → 显示与亮度 → 文字大小，调到最大再进 App
2. Android：设置 → 显示 → 字体大小 / 显示大小，调到最大再进 App
3. 重点检查：导航栏、Tab、列表 item、按钮、弹窗、表单

---

**结论**：优先在入口统一控制 `allowFontScaling` / `maxFontSizeMultiplier`，比逐个组件打补丁更稳，也更不容易漏。
