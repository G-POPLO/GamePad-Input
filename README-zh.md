# GamePad 扩展

[![Firefox Add-ons](https://img.shields.io/badge/Firefox-141e24.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/addon/gamepad-input)
[![Node.js CI](https://github.com/G-POPLO/GamePad-Input/actions/workflows/ci.yml/badge.svg)](https://github.com/G-POPLO/GamePad-Input/actions/workflows/ci.yml)

## 语言

- [English](README.md)
- [中文](README-zh.md)

## 概述

GamePad 扩展允许您使用游戏手柄控制网页。此扩展程序设计用于各种网页，包括新标签页，并为浏览和与网页内容交互提供了无缝体验。

## 功能

- **游戏手柄控制**：使用您的游戏手柄来导航和与网页进行交互。
- **可自定义轴**：选择游戏手柄上的哪些轴用于导航。
- **可自定义按钮映射**：将游戏手柄按钮重新映射到不同的浏览器操作。
- **新标签页支持**：支持自定义的新标签页，包括第三方扩展如 Infinity 新标签页。
- **光标模式**：使用游戏手柄控制虚拟光标进行精确点击。
- **焦点导航**：使用游戏手柄在可聚焦元素之间移动。

## 安装

```sh
git clone https://github.com/G-POPLO/GamePad-Input.git
```

### 在 Chrome 中加载扩展

1. 打开 Chrome 并访问 `chrome://extensions/`。
2. 点击右上角的开关启用“开发者模式”。
3. 点击“加载已解压的扩展程序”，然后选择构建后的 `dist` 目录。

## 使用

1. 打开一个网页或新标签页。
2. 连接您的游戏手柄。
3. 使用选定的轴来导航和与网页进行交互。

默认控制：

- **Y 按钮**：刷新当前页面。
- **B 按钮**：关闭当前标签页。
- **A 按钮**：创建新标签页。
- **X 按钮**：复制当前标签页。
- **左扳机（LB）**：切换到前一个标签页。
- **右扳机（RB）**：切换到下一个标签页。
- **左触发器（LT）**：后退历史记录。
- **右触发器（RT）**：前进历史记录。

## 开发

```sh
# 安装依赖
pnpm install

# 启动开发服务器（支持热更新）
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test

# 运行代码检查
pnpm lint

# 格式化代码
pnpm format
```

## 配置

该扩展程序允许您配置游戏手柄上用于导航的轴和按钮。您可以在扩展程序的选项页面中更改这些设置。

## 贡献

欢迎贡献！如果您有任何建议、错误报告或功能请求，请打开 issue 或提交 pull request。

## 许可

该项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。
