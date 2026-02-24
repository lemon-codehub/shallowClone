# GitHub Shallow Clone Button

[English README](./README.md)

这是一个轻量级 Chrome 扩展，会在 GitHub 仓库页面的 **Code** 按钮旁新增 **Shallow clone** 按钮。

点击后可一键复制：

```bash
git clone --depth=1 https://github.com/<owner>/<repo>.git
```

## 功能特性

- 在 GitHub 仓库页面的 **Code** 按钮旁添加按钮。
- 一键复制浅克隆命令。
- 支持 GitHub 动态页面跳转（PJAX/Turbo）。
- 兼容新版 GitHub UI，并包含旧布局回退逻辑。
- 权限最小化（仅 `clipboardWrite`）。

## 安装方式（Chrome / Edge）

1. 下载本仓库 ZIP，或直接克隆到本地。
2. 打开 `chrome://extensions/`（Edge 为 `edge://extensions/`）。
3. 开启 **开发者模式**。
4. 点击 **加载已解压的扩展程序**（Load unpacked）。
5. 选择当前项目文件夹。

## 使用方法

1. 打开任意 GitHub 仓库页面，例如：
   `https://github.com/owner/repo`
2. 在 **Code** 按钮旁找到 **Shallow clone**。
3. 点击按钮。
4. 在终端粘贴命令执行。

## 示例

```bash
git clone --depth=1 https://github.com/octocat/Hello-World.git
```

## 文件说明

- `manifest.json`：Chrome 扩展清单（MV3）
- `content.js`：按钮注入与复制逻辑
- `README.md`：英文文档
- `README.zh-CN.md`：中文文档

## 常见问题

- 按钮没有出现：
  - 确认当前页面是仓库主页（`https://github.com/<owner>/<repo>`）。
  - 扩展重载后刷新页面。
  - 在 `chrome://extensions/` 确认扩展已启用。
- 复制失败：
  - 先点击页面任意位置，再重试一次复制。

## 开发调试

代码修改后：

1. 打开 `chrome://extensions/`
2. 点击该扩展的 **刷新**（Reload）
3. 刷新 GitHub 页面

## 许可证

MIT
