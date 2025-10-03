---
title: GO 1.25.1 学习
date: 2025-09-29 20:25:33
tags:
- go
---

## 1. 安装 Go 开发环境
1. 进入 官方网址: `https://go.dev/dl/`, 找到合适的版本, 然后下载
![install](install.png)
按照提示安装完成后, 可以在终端输入 `go version`检查 `Go` 是否安装成功
![go version](version.png)

2. 下载 `IDE`

- GoLand: https://www.jetbrains.com/go/download
- Vscode: https://code.visualstudio.com/

## 2. 初始化`GO`, 输出 `hello world`

- 初始化模块: `go mod init learn-go`

- 输出结果为:
![mod init](mod-init.png)

- 创建主程序文件:
```go
package main

import "fmt"

func main() {
	fmt.Println("✅ Go 模块设置成功！")
	fmt.Println("🎉 现在可以开始开发了")
	fmt.Println("❤ Hello world")
}
```

- 输出下图则表示成功
![hello world](hello-world.png)
# 3. 创建主程序文件