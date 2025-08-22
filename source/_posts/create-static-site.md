---
title: 搭建 Hexo + GitHub 网站指南
date: 2025-08-22 10:42:27
tags:
  - hexo
  - github pages
---

## 1. 前期准备

1. 安装 [Node.js](https://nodejs.org/) (包含 npm)
2. 安装 [Git](https://git-scm.com/)
3. 注册 [GitHub](https://github.com/) 账号

## 2. 安装 Hexo

1. 打开终端/命令行，安装 Hexo CLI:

   ```bash
   npm install -g hexo-cli
   ```

2. 初始化 Hexo 项目:

   ```bash
   hexo init my-blog
   cd my-blog
   npm install
   ```
  ![hexo init](hexo-init.png)
3. 本地测试

   ```bash
   hexo server
   ```

   访问 `http://localhost:4000` (默认端口为4000) 查看效果， 默认有一个hello world 默认博客
  
## 3. 配置 GitHub Pages

### 新建 GitHub 仓库并提交
1. 在 GitHub 上创建新仓库，命名为 `你的用户名.github.io` (必须使用这个格式)
  ![create repository](create-repository.png)
2. 按照常规提交代码到此仓库
    ```git
    git status
    git add .
    git commit -m'first commit'
    git branch -M main
    git remote add origin https://github.com/erchahu/erchahu.github.io.git # 这里用自己的github name
    git push origin main
    ```

### 新建 github action 工作流
1. 使用 `node --version` 指令检查电脑上的 Node.js 版本。 记下主要版本（例如，v20.y.z）
2. 在 `.github`文件夹下 新建文件 `workflows/pages.yml` 
  ```yml
  name: Pages

  on:
    push:
      branches:
        - main # default branch

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          with:
            token: ${{ secrets.GITHUB_TOKEN }}
            # If your repository depends on submodule, please see: https://github.com/actions/checkout
            submodules: recursive
        - name: Use Node.js 20
          uses: actions/setup-node@v4
          with:
            # Examples: 20, 18.19, >=16.20.2, lts/Iron, lts/Hydrogen, *, latest, current, node
            # Ref: https://github.com/actions/setup-node#supported-version-syntax
            node-version: "20"
        - name: Cache NPM dependencies
          uses: actions/cache@v4
          with:
            path: node_modules
            key: ${{ runner.OS }}-npm-cache
            restore-keys: |
              ${{ runner.OS }}-npm-cache
        - name: Install Dependencies
          run: npm install
        - name: Build
          run: npm run build
        - name: Upload Pages artifact
          uses: actions/upload-pages-artifact@v3
          with:
            path: ./public
    deploy:
      needs: build
      permissions:
        pages: write
        id-token: write
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      steps:
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
    ```

3. 修改 github setting
![github-setting](github-setting.png)
修改这个source为`GitHub Actions`

4. 提交代码， 部署完成之后， 即可前往 `username.github.io` 查看网页。

