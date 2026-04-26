export const migrationPlan = [
  {
    id: "shell",
    title: "入口导航与整体壳层",
    status: "recommended-first",
    source: "../prototype/MBL制单原型_1比1入口.html",
    outcome: "先用 React 重建页面导航、搜索、布局容器和 iframe 替代层。"
  },
  {
    id: "list",
    title: "MBL 制单列表",
    status: "phase-1",
    source: "../prototype/axure-export/mbl制单列表__最新版本）__0316版本）（0330）（v0410_.html",
    outcome: "迁移筛选、表格、状态标签和操作入口，是后续详情跳转的主入口。"
  },
  {
    id: "detail",
    title: "详情页主流程",
    status: "phase-1",
    source: "../prototype/axure-export/详情-待提交船司.html",
    outcome: "迁移字段表单、字段来源展示、审单动作和异常提示。"
  },
  {
    id: "exception",
    title: "异常与关闭流转",
    status: "phase-2",
    source: "../prototype/axure-export/详情-预览件提交异常.html",
    outcome: "统一异常态、关闭态和提交中等只读页面，减少重复实现。"
  },
  {
    id: "supplementary",
    title: "辅助预览与审计页面",
    status: "phase-3",
    source: "../prototype/previews/mbl-local-preview.html",
    outcome: "将本地预览、字段审单和说明页面迁移成内部工具页。"
  }
];
