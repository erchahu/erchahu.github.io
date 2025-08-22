---
title: Hexo 基本配置 && 资源 && 主题
date: 2025-08-22 14:32:53
tags:
 - hexo
---

## 1. 基本配置

hexo 的基本配置文件都在 `_config.yml` 中修改。

| 设置        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| title       | 网站标题                                                     |
| subtitle    | 网站副标题                                                   |
| description | 网站描述                                                     |
| keywords    | 网站的关键词。 支持多个关键词。                              |
| author      | 您的名字                                                     |
| language    | 网站使用的语言。 使用 2 个字母的 ISO-639-1 代码，或 它的变体。 默认为 en。 |
| timezone    | 网站时区。 Hexo 默认使用您电脑的时区。 请参考 时区列表 进行设置，如 America/New_York, Japan, 和 UTC 。 一般的，对于中国大陆地区可以使用 Asia/Shanghai。 |

![config](default-config.png)

## 2. 资源文件夹

### 2.1 全局资源文件夹

> 资源（`Asset`）代表 `source` 文件夹中除了文章以外的所有文件，例如图片、CSS、JS 文件等。

如果`Hexo`项目中只有少量图片，那最简单的方法就是将它们放在 `source/images` 文件夹中。 然后通过类似于 `![](/images/image.jpg)` 的方法访问。

### 2.2 文章资源文件夹

> 如果想更有规律地提供图片和其他资源以及想要将他们的资源分布在各个文章上，如图
> ![page assets](page-assets.png)
> 可以看到我们每一篇 .md 文件都有对应的 文件夹，这个文件夹就是用来存放资源的。

我们只需要将 `config.yml` 文件中的 `post_asset_folder` 选项设为 `true` 来打开。

```yml
post_asset_folder: true
```

当资源文件管理功能打开后，`Hexo`将会在每一次通过 `hexo new [layout] <title>` 命令创建新文章时自动创建一个文件夹。 将所有与你的文章有关的资源放在这个关联文件夹中之后，你可以通过相对路径来引用它们。

### 2.3 如何使用MarkDown 嵌入图片
设置`config.yml`

```yml
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

启用后，资源图片将会被自动解析为其对应文章的路径。 
例如： image.jpg 位置为 /2020/01/02/foo/image.jpg ，这表示它是 /2020/01/02/foo/ 文章的一张资源图片， ![](image.jpg) 将会被解析为 <img src="/2020/01/02/foo/image.jpg"> 。

启用后使用图片示例
![example](assets-eg.png)

### 2.4如何使用其他方法嵌入图片

参考链接: [hexo asset-folders](https://hexo.io/docs/asset-folders)

## 3. 主题

[主题地址传送门](https://hexo.io/themes/)
这里用的是 [安知鱼主题](https://github.com/anzhiyu-c/hexo-theme-anzhiyu)

在博客的根目录安装:
```bash
git clone -b main https://github.com/anzhiyu-c/hexo-theme-anzhiyu.git themes/anzhiyu
```

修改 `hexo` 配置文件`_config.yml`，把主题改为`anzhiyu`

如果没有 `pug` 以及 `stylus` 的渲染器，请下载安装： `npm install hexo-renderer-pug hexo-renderer-stylus --save`

完成之后请重新启动服务
![theme](them.png)