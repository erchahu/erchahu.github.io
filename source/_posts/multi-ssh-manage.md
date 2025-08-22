---
title: 多个SSH账号管理
date: 2025-08-22 11:14:30
tags: git
---

> 为不同的账号生成不同的 SSH 密钥对，并通过 SSH 配置文件 (~/.ssh/config) 来管理它们，让 Git 根据仓库的远程地址自动使用对应的密钥。

使用 SSH 配置
### 步骤 1：为每个账号生成独立的 SSH 密钥
默认情况下，系统会使用 `~/.ssh/id_rsa`。我们需要为第二个（或更多）账号生成新的密钥，并取一个特别的名字。

1. 为第一个账号（例如个人账号）生成密钥（如果你还没有，或者想重新生成）
  ```bash
  ssh-keygen -t ed25519 -C "your_personal_email@example.com"
  ```
  当提示 “Enter file in which to save the key” 时，输入一个独特的路径和名字，例如：`~/.ssh/id_ed25519_personal`

2. 为第二个账号（例如工作账号）生成密钥：
  ```bash
  ssh-keygen -t ed25519 -C "your_work_email@example.com"
  ```

> 注意：`-t ed25519` 是一种更现代、更安全的算法。如果你的系统过旧不支持，可以使用 `-t rsa -b 4096`。

### 步骤 2：将 SSH 公钥添加到对应的 GitHub 账号

1. 将公钥内容复制到剪贴板
    ```bash
    pbcopy < ~/.ssh/id_ed25519_personal.pub
    # 或者
    pbcopy < ~/.ssh/id_ed25519_work.pub

    # 或者
    cat ~/.ssh/id_ed25519_work.pub # 需手动复制
    ```
2. 登录到你的 个人 `GitHub` 账号 -> `Settings` -> `SSH and GPG keys` -> `New SSH key`
  - Title: 取一个能标识这台电脑的名字，如 MacBook Pro Personal
  - Key: 粘贴刚才复制的内容
3. 登录到你的 工作 `GitHub` 账号，重复以上步骤，添加另一个公钥。
  ![github add ssh](github-ssh.png)

### 步骤 3：创建和配置 SSH 配置文件

> `SSH` 配置文件让你可以定义针对不同主机（`github.com`）使用不同的密钥。

1. 创建或编辑 `~/.ssh/config` 文件：
    ```bash
    touch ~/.ssh/config
    code ~/.ssh/config # 第一种方式
    vim ~/.ssh/config # 第二种方式
    nano ~/.ssh/config # 第三种方式
    ```
2. 将以下配置内容添加到文件中

    ```bash
    # 个人账号 (默认账号，可选)
    Host github.com
      HostName github.com
      User git
      IdentityFile ~/.ssh/id_ed25519_personal
      IdentitiesOnly yes

    # 工作账号
    Host github.com-work  # 这是一个别名（Alias），可以任意取名，但不要是 github.com
      HostName github.com
      User git
      IdentityFile ~/.ssh/id_ed25519_work
      IdentitiesOnly yes
    ```

    > 关键点：第二个配置的 `Host` 是 `github.com-work`，这不是真实的主机名，只是一个我们自定义的别名。真实的主机名由 `HostName github.com` 指定。

### 步骤 4：测试 SSH 连接
测试第一个账号配置
  ```bash
  ssh -T git@github.com
  ```
  输出下图即表示可行: Hi <你的个人用户名>! You've successfully authenticated...
  ![git config test](git-config-test.png)

测试第二个账号配置
  ```bash
  ssh -T git@github.com-work
  ```
  输出应与第一个类似

### 步骤 5：克隆和配置仓库

> 现在config已经配置成功，当我们克隆仓库时，需要根据账号修改远程地址

1. 克隆个人账号的仓库（使用默认主机名）：
```bash
git clone git@github.com:personal_username/personal_repo.git
```

2. 克隆工作账号的仓库（必须使用自定义的主机别名）：
```bash
# 注意：这里将 ‘github.com’ 替换成了配置文件中定义的别名 ‘github.com-work’
git clone git@github.com-work:company_username/company_repo.git
```

3. 对于现有的仓库

> 如果已经克隆了一个仓库，但现在想切换它使用的账号，可以修改该仓库下的 `.git/config` 文件中的 `url`：

```bash
[remote "origin"]
    url = git@github.com-work:company_username/company_repo.git
    # 从原来的 git@github.com:... 修改为 git@github.com-work:...
```

### 步骤 6：配置 Git 用户信息（解决提交者作者信息）

> 上面的 `SSH` 配置只解决了认证问题。`Git` 提交时记录的 `user.name` 和 `user.email` 是单独设置的。需要确保每个仓库都使用正确的用户信息，否则个人仓库的提交可能会显示工作邮箱。

1. 设置全局配置（作为默认备选）
```bash
git config --global user.name "Your Personal Name"
git config --global user.email "your_personal_email@example.com"
```

2. 为工作项目创建特定目录，并设置覆盖规则

> 假设工作项目都放在 `~/Code/work` 目录下

- 编辑全局 `Git` 配置文件

  ```bash
  code ~/.gitconfig
  ```

  在文件末尾添加以下内容，使用 `includeIf` 指令：


  ```ini
  [includeIf "gitdir:~/Code/work/"]
    path = ~/.gitconfig-work
  ```

  这表示：当当前仓库的路径在 `~/Code/work/` 或其子目录下时，会自动应用 `~/.gitconfig-work` 文件中的配置。

  ![git config](git-config.png)

3. 创建工作专用的配置文件
  ```bash
  code ~/.gitconfig-work
  ```

  内容为
  ```ini
  [user]
    name = Your Work Name
    email = your_work_email@example.com
  ```
  ![git config 2](git-config-2.png)

现在，只要把工作仓库克隆到 `~/Code/work/` 目录下，任何提交都会自动使用工作的用户名和邮箱。而其他目录下的仓库则会使用个人全局配置。