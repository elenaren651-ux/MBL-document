# MBL Document Prototype

MBL 制单项目原型仓库。

这个仓库现在采用“原型基线 + React 预留工作区”的结构，方便：

- 在 GitHub 上存档和协作
- 继续迭代当前原型
- 后续逐步重构为正式前端项目

## 目录说明

- `prototype/`
  - 当前可运行原型和预览资源
- `prototype/axure-export/`
  - 原始 Axure 导出资源，作为 1:1 基线保留
- `prototype/previews/`
  - 字段审单、本地预览等辅助页面
- `docs/prd/content/`
  - PRD 拆分文档
- `docs/product/`
  - 产品背景、愿景与 MVP 范围
- `docs/engineering/`
  - 前端迁移计划和工程实现文档
- `docs/rules/`
  - 补充业务规则文档
- `docs/prototype/`
  - 原型迭代说明
- `docs/reference/`
  - 参考图片和辅助资料
- `skills/`
  - 项目内沉淀的 AI 方法论与 MBL 业务 skill
- `app/`
  - 已初始化的 Vite + React 工作区，用于后续正式前端迁移
- `MBL制单原型_1比1入口.html`
  - 根目录兼容入口，会跳转到 `prototype/MBL制单原型_1比1入口.html`
- `index.html`
  - 仓库默认入口，便于静态托管和后续接 React

## 本地预览

这是一个静态原型项目，不需要安装依赖。

直接打开下面的文件即可：

- `index.html`
- `MBL制单原型_1比1入口.html`
- `prototype/MBL制单原型_1比1入口.html`

后续如果继续迭代原型入口，默认更新：

- `prototype/MBL制单原型_1比1入口.html`

如果需要本地服务预览，可以在仓库目录运行任意静态文件服务，例如：

```bash
python3 -m http.server 4173
```

然后访问：

- `http://localhost:4173/prototype/MBL%E5%88%B6%E5%8D%95%E5%8E%9F%E5%9E%8B_1%E6%AF%941%E5%85%A5%E5%8F%A3.html`

## React 工作区

如果要开始正式前端迁移，请进入 `app/`：

```bash
cd app
npm install
npm run dev
```

默认开发端口是 `5173`。

## 后续重构建议

建议采用“保留原型基线 + 在 app/ 中逐步迁移”的方式推进，例如：

1. 保留 `prototype/axure-export/` 作为验收和对照基线
2. 从 `app/src/` 的迁移工作台开始搭建 React 页面结构
3. 优先重构入口导航、列表页、详情页等核心页面
4. 每次重构都对照 `prototype/axure-export/` 做视觉和交互校验

这样做的好处是：

- 不会破坏当前可用原型
- 可以分阶段迁移
- Git 历史会同时保留“原型版本”和“正式代码版本”

## 当前整理原则

- 保留现有页面和资源文件
- 清理本地日志和系统缓存文件
- 先完成 GitHub 入库，再逐步结构化重构
