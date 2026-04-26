# React Refactor Workspace

这个目录现在已经是一个可启动的 `Vite + React` 工作区。

## 启动方式

```bash
npm install
npm run dev
```

## 建议迁移顺序

1. 先在 `src/` 中重建入口导航和布局壳子
2. 再按页面优先级迁移列表页、详情页、异常流页面
3. 每迁移一页，都对照 `../prototype/axure-export/` 做 1:1 校验

## 当前说明

- `src/data/migrationPlan.js` 记录了推荐迁移顺序
- `src/App.jsx` 是当前迁移工作台首页
- 默认不接入路由，先保持最小可运行骨架
