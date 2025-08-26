# 智能记账小程序开发文档

## 项目概述

该项目旨在开发一个基于 Vue 3 和 TypeScript 的智能记账小程序，使用 Uni-app 开发，并通过 Uni-Cloud 提供后端支持。我们使用 WOT UI 作为组件库，Pinia 管理应用状态，Vite 作为构建工具以提升开发体验和效率。

## 技术栈

### 前端技术

- **Vue 3**：用于构建用户界面。
- **TypeScript**：提升代码的可维护性和可扩展性，增强类型检查。
- **Pinia**：作为状态管理工具，取代 Vuex，简化应用的状态管理。
- **Wot UI**：UI 组件库，用于快速构建用户界面。
- **Vite**：现代化的构建工具，优化开发环境和生产环境的构建速度。

### 后端技术

- **Uni-Cloud**：为小程序提供云函数、数据库、存储等后端服务。

## 项目结构

```bash
simple-ledger/
├── src/                   # 源代码目录
│   ├── components/        # 公共组件
│   │   ├── Layout/       # 布局组件
│   │   └── TabBar/       # 底部导航栏组件
│   ├── pages/            # 页面目录
│   │   ├── home/         # 首页
│   │   ├── mine/         # 个人中心
│   │   ├── record/       # 记账
│   │   └── statistics/   # 统计页面
│   ├── static/           # 静态资源
│   │   ├── iconfont/     # 图标字体
│   │   └── style/        # 全局样式
│   ├── stores/           # Pinia 状态管理
│   │   ├── home/        
│   │   └── tabbar/       
│   ├── utils/            # 工具函数
│   ├── uni_modules/      # uni-app插件
│   ├── App.vue           # 应用入口组件
│   ├── main.ts           # 应用入口文件
│   ├── manifest.json     # 应用配置
│   ├── pages.json        # 页面配置
│   ├── uni.scss          # 全局样式变量
│   └── env.d.ts          # 类型声明
├── index.html            # H5入口文件
├── tsconfig.json         # TypeScript配置
├── vite.config.ts        # Vite配置
├── package.json          # 项目依赖配置
└── README.md             # 项目说明文档
```

## 项目配置

### 推荐使用 HbuildX 运行项目

### 安装依赖

在项目根目录下运行以下命令安装项目依赖：

```bash
npm install
```

### 启动开发服务器

在项目根目录下运行以下命令启动开发服务器：

```bash
npm run dev:mp-weixin
```

### 构建项目

在项目根目录下运行以下命令构建项目：

```bash
npm run build:mp-weixin
```

## 贡献指南

欢迎对本项目进行贡献。请确保在提交 Pull Request 之前，已经阅读并遵循了项目的贡献指南。

## 许可证

本项目遵循 MIT 许可证。请查看 `LICENSE` 文件了解更多信息。