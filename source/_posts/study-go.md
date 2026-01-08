---
title: GO 1.25.1 学习
date: 2025-09-29 20:25:33
tags:
- go
---

## 一、安装 Go 开发环境<持续进行>
进入 官方网址: `https://go.dev/dl/`, 找到合适的版本, 然后下载
![install](install.png)
按照提示安装完成后, 可以在终端输入 `go version`检查 `Go` 是否安装成功
![go version](version.png)
使用VScode可以下载对应插件
![alt text](plugin.png)

## 二、新建一个Go项目

### 新建项目

```bash
# 创建学习目录
mkdir -p ~/go-learning/day01
cd ~/go-learning/day01

# 初始化模块（这是Go 1.11+的必须步骤）
go mod init day01
```

操作后会看到创建了 `go.mod` 文件，内容内容为：
![alt text](init-project.png)

### 新建Hello world

1. 在 `go.mod` 同级目录下新建`main.go`

```go
package main // 每个Go文件都以package声明开始

import "fmt" // 导入标准库的fmt包

func main() {
	fmt.Println("Hello, Go 世界!")
}
```

2. 如何运行?

2.1 Vscode中右键`Run Code`,需要配置插件 `Code Runner`
2.2 使用命令行语句 `go run main.go`

就可以看到输出了 `Hello, Go 世界!`

2.3 编译为可执行文件
```bash
go build main.go

# 运行编译后的程序（Windows是go.exe）
./go  # Linux/Mac
go.exe  # Windows
```

![alt text](run-terminal.png)
![alt text](build-tree.png)