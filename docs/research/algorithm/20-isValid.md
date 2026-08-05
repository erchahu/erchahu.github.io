---
title: 20. 有效的括号
outline: deep
---

# 20. 有效的括号

> 给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。
>
> 有效字符串需满足：
>
> 1. 左括号必须用相同类型的右括号闭合。
> 2. 左括号必须以正确的顺序闭合。
> 3. 每个右括号都有一个对应的相同类型的左括号。

### 示例

**示例 1：**

- 输入：`s = "()"`
- 输出：`true`

**示例 2：**

- 输入：`s = "()[]{}"`
- 输出：`true`

**示例 3：**

- 输入：`s = "(]"`
- 输出：`false`

**示例 4：**

- 输入：`s = "([])"`
- 输出：`true`

**示例 5：**

- 输入：`s = "([)]"`
- 输出：`false`

### 解法

用栈模拟括号匹配：遇到左括号入栈，遇到右括号则弹出栈顶并检查是否成对；最后栈为空则有效。

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const stack = [];
  const map = {
    "(": ")",
    "{": "}",
    "[": "]",
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (map[char]) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (map[last] !== char) {
        return false;
      }
    }
  }

  return stack.length === 0;
};
```
