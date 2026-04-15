---
title: study-algorithm
date: 2026-04-15 23:37:58
tags: 
- algorithm
---

# 数据结构与算法 持续学习 ing

## 入门

### 数据结构

什么是数据结构? - 数据在计算机中存储和组织的方式

1. 数组 --- 连续排列，有编号
2. 链表 --- 分散存放，通过指针连接
3. 栈 --- 后进先出 (LIFO)
4. 队列 --- 先进先出 (FIFO)
5. 哈希表 --- 键值对，快速查找
6. 树 --- 层级关系
7. 图 --- 网状关系

```js
// 场景：存储 1, 2, 3 三个数字

// 1. 数组 - 连续内存空间
const array = [1, 2, 3];
// 内存示意：[1][2][3] 紧挨着

// 2. 链表节点 - 分散内存，通过指针连接
class ListNode {
  constructor(val) {
    this.val = val;      // 值
    this.next = null;    // 指向下一个节点的指针
  }
}
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);
node1.next = node2;
node2.next = node3;
// 内存示意：节点1(地址:0x001) → 节点2(地址:0x789) → 节点3(地址:0x456)

// 3. 对象/哈希表 - 键值对
const obj = { a: 1, b: 2, c: 3 };
```

### 算法