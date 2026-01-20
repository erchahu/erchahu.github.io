---
title: git-commitlint
date: 2026-01-20 19:37:35
tags:
---

# Commitlint 使用指南

## 什么是 Commitlint？

Commitlint 是一个 Git 提交信息检查工具，它可以帮助团队规范 Git 提交信息的格式，使提交历史更加清晰、易读。

## 为什么要使用 Commitlint？

- ✅ **统一的提交格式**：让团队成员遵循相同的提交规范
- ✅ **清晰的提交历史**：方便查看项目变更记录
- ✅ **自动生成 Changelog**：配合工具可自动生成版本更新日志
- ✅ **更好的协作**：让其他开发者快速理解每次提交的目的

## Get start

**安装依赖**

```bash
# npm
npm install -D @commitlint/cli @commitlint/config-conventional

#yarn
yarn add -D @commitlint/cli @commitlint/config-conventional

#pnpm
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**初始化Config文件**

```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

**配置 commitlint.config.js**
```ts
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式调整
        'refactor', // 代码重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'chore',    // 构建/工具变更
        'revert',   // 回退
        'ci',       // CI/CD 相关
        'build',    // 构建系统/依赖变更
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
```

**要使用 commitlint，需要设置 commit-msg 钩子.**

配置 Husky

```bash
npx husky init  

echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

如果自动生成了`.husky/pre-commit`, 可以删除掉这个文件

## 提交信息格式

```
<type>(<scope>): <subject>
```

### 类型 (type)

提交类型必须是以下之一<这里可以自定义增减,下列表是常用的类型>：

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add user login feature` |
| `fix` | 修复 Bug | `fix: resolve crash on app startup` |
| `docs` | 文档更新 | `docs: update README` |
| `style` | 代码格式调整（不影响逻辑） | `style: format code with prettier` |
| `refactor` | 代码重构 | `refactor: simplify authentication flow` |
| `perf` | 性能优化 | `perf: optimize image loading` |
| `test` | 测试相关 | `test: add unit tests for utils` |
| `chore` | 构建/工具变更 | `chore: update dependencies` |
| `revert` | 回退之前的提交 | `revert: feat: remove old feature` |
| `ci` | CI/CD 配置变更 | `ci: configure github actions` |
| `build` | 构建系统或依赖变更 | `build: upgrade react native` |

### 作用域 (scope)

作用域是可选的，用于说明本次提交影响的具体模块：

```
feat(auth): add OAuth login support
fix(homepage): resolve image overflow issue
style(components): format button styles
```

### 描述 (subject)

- 简洁描述本次提交的内容
- **不超过 100 个字符**
- **不要以句号结尾**
- 使用小写字母

## 提交示例

### ✅ 正确示例

```bash
# 新功能
git commit -m "feat: add user profile page"

# 带作用域
git commit -m "feat(api): implement user authentication"

# 修复 Bug
git commit -m "fix: resolve app crash on iOS 15"

# 文档更新
git commit -m "docs: add installation guide"

# 代码重构
git commit -m "refactor: simplify navigation structure"

# 多行提交（添加详细描述）
git commit -m "feat: implement shopping cart

- Add product selection functionality
- Implement quantity adjustment
- Add price calculation feature
"
```

### ❌ 错误示例

```bash
# 类型不在允许范围内
git commit -m "add: new feature"

# 描述为空
git commit -m "feat:"

# 以句号结尾
git commit -m "feat: add new feature."

# 类型大写
git commit -m "Feat: add new feature"

# 描述超过 100 字符
git commit -m "feat: add a very very very very very very very very very very very long description"
```

## 常见错误与处理

### 1. 类型错误

```bash
✖ type must be one of [feat, fix, docs, style, refactor, perf, test, chore, revert, ci, build]
```

**解决方法**：使用允许的类型之一

### 2. 描述为空

```bash
✖ subject may not be empty
```

**解决方法**：添加提交描述

### 3. 类型大写

```bash
✖ type must be lower-case
```

**解决方法**：使用小写类型

### 4. 描述以句号结尾

```bash
✖ subject may not end with full stop
```

**解决方法**：移除结尾的句号

### 5. 描述过长

```bash
✖ subject may not be longer than 100 characters
```

**解决方法**：缩短描述或使用多行提交

## 多行提交格式

如果需要添加更详细的描述，可以使用多行格式：

```bash
git commit -m "feat: add payment feature

- Implement credit card payment
- Add payment confirmation screen
- Integrate with payment gateway API

Closes #123"
```

## 修改错误的提交信息

如果提交信息不符合规范，可以使用以下方法修改：

### 修改最后一次提交

```bash
git commit --amend -m "fix: correct typo in user name"
```

### 修改历史的提交

```bash
# 交互式变基
git rebase -i HEAD~n

# 将需要修改的提交标记为 edit
# 保存后修改提交信息
git commit --amend -m "new message"
git rebase --continue
```

## 配置说明

按照配置则项目已配置以下规则：

- ✅ 类型必须是允许的类型之一
- ✅ 类型必须小写
- ✅ 类型不能为空
- ✅ 描述不能为空
- ✅ 描述不能以句号结尾
- ✅ 描述不超过 100 字符

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint 官方文档](https://commitlint.js.org/)
