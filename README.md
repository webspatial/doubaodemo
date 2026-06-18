# doubaodemo

一个用于验证 WebSpatial 与 Radix Dropdown Menu 集成方式的 Vite + React demo。工程通过四个对照场景展示菜单内容如何作为空间 surface 渲染，以及插件项如何从独立 root 注入到可见菜单层。

## 背景

这个 demo 主要关注以下问题：

- Radix `DropdownMenu.Content` 如何配合 `asChild` 和 `enable-xr` 变成 WebSpatial surface。
- 多个 Radix root 之间如何通过 `useSpatialOverlay` / `portalMenuOption` 共享可见菜单层。
- 菜单 portal 在普通页面和父 `SpatialDiv` 空间窗口内的差异。
- 类似 plugin host 的场景下，宿主菜单 surface 与插件菜单项逻辑如何解耦。

## 快速开始

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在：

```text
http://127.0.0.1:5179
```

构建生产产物：

```bash
pnpm build
```

预览生产产物：

```bash
pnpm preview
```

## Demo 场景

### A. 主页面浮动菜单

对应文件：[src/demo/BaselineDemo.tsx](src/demo/BaselineDemo.tsx)

单个 Radix root，`DropdownMenu.Portal` 挂到页面 root，`DropdownMenu.Content` 使用 `asChild` 包裹一个带 `enable-xr` 的 `div`。菜单内容会作为独立 WebSpatial surface 浮在主页面之上。

### B. 双 Root + SpatialOverlay

对应文件：[src/demo/ShadowPortalDemo.tsx](src/demo/ShadowPortalDemo.tsx)

visible root 负责菜单 trigger 和可见 surface，shadow root 保持常开并承载插件项逻辑。shadow root 中的菜单项通过 `portalMenuOption` 注入到 visible surface 里的 `OverlayTarget`。

### C. 父 SpatialDiv 内双 Root

对应文件：[src/demo/SurfaceConflictDemo.tsx](src/demo/SurfaceConflictDemo.tsx)

外层 `div enable-xr` 提供父空间上下文，visible root 和 shadow root 都 portal 到 `useSpatialPortalContainer()` 返回的父空间窗口中。菜单自身仍然是一个子 `enable-xr` surface。

### D. Plugin Host 场景

对应文件：[src/demo/PluginHostMenuDemo.tsx](src/demo/PluginHostMenuDemo.tsx)

更贴近真实 plugin host 的结构：宿主负责展示菜单 surface，插件侧负责根据候选列表产出菜单项。插件项通过 WebSpatial overlay 注入到宿主菜单中，并可以调用宿主提供的 `closeMenu` 关闭菜单。

## 关键实现点

- Vite React 插件配置了 `jsxImportSource: "@webspatial/react-sdk"`，用于支持 WebSpatial JSX runtime。
- `tsconfig.json` 同样配置了 `jsxImportSource`，保证 TypeScript 编译与 Vite JSX 转换一致。
- `@webspatial/react-sdk` 和 `@webspatial/core-sdk` 当前使用 `pkg.pr.new` 的预览包版本，便于验证 WebSpatial overlay 相关 PR 能力。
- 页面底部的事件日志会记录菜单 open 状态、插件开关和菜单项 DOM parent 信息，方便观察 portal / overlay 后的实际挂载位置。

## 目录结构

```text
.
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── demo/
│       ├── BaselineDemo.tsx
│       ├── ShadowPortalDemo.tsx
│       ├── SurfaceConflictDemo.tsx
│       ├── PluginHostMenuDemo.tsx
│       ├── ShadowPortalItems.tsx
│       ├── DemoCard.tsx
│       ├── types.ts
│       └── utils.ts
├── RADIX_WEBSPATIAL_RECOMMENDATIONS.md
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 相关文档

- [RADIX_WEBSPATIAL_RECOMMENDATIONS.md](RADIX_WEBSPATIAL_RECOMMENDATIONS.md)：Radix 与 WebSpatial 集成建议。
- [docs/superpowers/plans/2026-06-16-demo-runtime-consistency-plan.md](docs/superpowers/plans/2026-06-16-demo-runtime-consistency-plan.md)：demo runtime 一致性计划。
- [docs/superpowers/plans/2026-06-16-plugin-host-menu-webspatial-plan.md](docs/superpowers/plans/2026-06-16-plugin-host-menu-webspatial-plan.md)：plugin host 菜单 WebSpatial 集成计划。
