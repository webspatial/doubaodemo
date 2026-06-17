# Radix Dropdown x WebSpatial 调研建议

## 问题定义

当前要解决的是一个**结构兼容性问题**：

- 菜单使用 `Radix DropdownMenu`
- 菜单项通过 `shadow root + createPortal` 注入到可见菜单
- Pico / WebSpatial 下菜单又需要具备空间表面语义和 Z 轴前浮能力

目标不是重写整个菜单体系，而是回答下面这个问题：

> 在保留现有“插件宿主 + 菜单项注册”思路的前提下，如何让这类菜单在 WebSpatial 中稳定工作，并且在打开后表现为空间浮层。

## 文档适用范围

这份文档故意只依赖两个小仓：

- `doubaodemo`
- `webspatial-sdk`

后续高阶模型如果无法访问更大的业务仓库，也应当能仅凭这份文档继续推进调研、设计和测试方案。

## 术语

为了避免歧义，本文统一使用下面几个术语：

### `visible root`

- 用户真正点击打开的 `DropdownMenu.Root`
- 负责展示用户肉眼看到的菜单外壳

### `shadow root`

- 一个隐藏的、通常保持打开状态的第二套 `DropdownMenu.Root`
- 菜单项逻辑上属于这套 root

### `portal target`

- `createPortal(content, target)` 中的 `target`
- 决定菜单项最终挂到哪个 DOM 节点

### `outer content`

- Radix `DropdownMenu.Content` 自身对应的外层节点
- 更接近 Radix 的定位、测量和焦点语义

### `inner spatial surface`

- 真实承载 `enable-xr` / 空间显示语义的内部节点
- 更接近“真正显示给用户看的空间面”

### `plugin host`

- 一套通用菜单宿主机制
- 它自己不关心具体业务，只负责：
  - 打开/关闭菜单
  - 提供 `portalMenuOption`
  - 遍历插件列表
  - 让各插件决定是否渲染自身菜单项

## 当前核心风险

当前结构最容易出问题的点，不是普通的单 root dropdown，而是下面这组组合：

- `visible root`
- `shadow root`
- `createPortal`
- `portal target`
- `inner spatial surface`

风险来自两个层面：

1. **逻辑归属与显示归属分裂**
   - 菜单项逻辑上属于 shadow root
   - 视觉上却显示在 visible root 对应的内容区

2. **outer / inner 目标不一致**
   - Radix 侧测量、定位、关闭时序更偏向 outer content
   - WebSpatial 侧真正承载空间显示语义的节点更像 inner spatial surface

## 现有 `doubaodemo` 场景

当前 demo 已包含四类场景：

### A. 单个 Root 基线

- 只有一个 `DropdownMenu.Root`
- 用来提供 Radix 正常工作时的行为基线

### B. 双 Root + Portal

- 显式模拟 `visible root + shadow root`
- 用来观察“逻辑归属”和“显示归属”分裂

### C. 双 Root + Portal + 模拟 Spatial Surface

- 增加 `outer content / inner spatial surface`
- 可切换：
  - `portal 到 outer`
  - `portal 到 inner`

### D. Plugin Host Demo

- 显式模拟插件宿主机制
- 包含：
  - `visible root`
  - `shadow root`
  - `portalMenuOption`
  - 插件列表 `list`
  - 插件可能返回 `null`

这个场景是当前最重要的，因为它更接近真实问题。

## Plugin Host Demo 想回答什么

`src/demo/PluginHostMenuDemo.tsx` 重点回答两个问题：

1. 在保留插件宿主机制时，`portalMenuOption` 最终更应该落到 `outer content` 还是 `inner spatial surface`
2. `visible root + shadow root + portal` 这套模式，在空间运行时下需要什么额外 contract 才能稳定工作

这个 demo 保留了“插件列表 + provider 决定是否产出内容”的形状，但这里关注的重点不是具体会渲染几个菜单项，而是：

- 插件内容属于哪一棵 root
- 最终被注入到哪个目标节点
- 这些节点和空间表面的关系是什么

## 当前最有价值的调研方向

在现阶段，最值得验证的不是“怎么推翻整套机制”，而是：

### 方向 1：`portal target` 的 contract

需要回答：

- `portalMenuOption` 默认应该打到 `outer content` 吗？
- 什么时候必须打到 `inner spatial surface`？
- 是否需要一个显式策略：
  - `outer`
  - `inner`
  - `auto`

### 方向 2：插件宿主机制是否可被稳定支撑

需要回答：

- `visible root + shadow root + portal` 这套模式在普通 DOM 下是否稳定
- 它在空间运行时下需要哪些额外 contract
- 是否可以在不改业务注册方式的前提下，由宿主层和 SDK 层兜住

### 方向 3：空间浮层的最小支持面

需要回答：

- 对 Radix 菜单来说，最小需要什么支持才算“空间浮层可用”
- 例如：
  - Z 轴前浮
  - 完整显示不被裁剪
  - 点击命中正常
  - 焦点和关闭时序正常

## 推荐的推进顺序

### 阶段 1：在 `doubaodemo` 中继续做结构实验

目标：

- 抽离结构问题
- 降低业务噪音
- 快速比较不同 `portal target` 策略

当前最值得继续增强的是：

- `PluginHostMenuDemo`
- `outer / inner / auto` 三种 target 策略
- 是否需要再增加一个 “content 自身即 spatial surface” 的变体

### 阶段 2：在 `webspatial-sdk` 中补 `Scenario 4`

建议新增：

- `Scenario 4 — Plugin-host dual-root menu`

目标：

- 把 `doubaodemo` 里验证过的结构，放到真实 SpatialDiv / portal 运行时里
- 让它成为一个正式、可回归的 SDK 测试场景

重点验证：

- 菜单是否整体在 Z 轴前浮
- 菜单项是否完整显示
- 点击命中是否正常
- 焦点与关闭时序是否正常
- `portal target = outer / inner / auto` 行为差异

### 阶段 3：有了稳定结论后再回到集成侧

只有当前两步得到稳定结论后，再去决定：

- 宿主层是否需要额外能力
- 内容层是否需要暴露 spatial surface contract
- SDK 是否需要增加更明确的浮层支持语义

## 适合交给高阶模型继续做的任务

如果后续让高阶模型接手，且它们只能访问：

- `doubaodemo`
- `webspatial-sdk`

那么最适合继续做的是：

1. 评审 `PluginHostMenuDemo` 是否足够同构
2. 设计 `webspatial-sdk Scenario 4`
3. 设计 `portal target` 的 contract
4. 设计测试策略：
   - 浏览器自动化
   - Spatial runtime 验证
   - 回归观测点
5. 评估哪些结论应当沉淀为 SDK 能力，哪些只属于宿主层策略

## 当前文档对应的代码入口

### `doubaodemo`

- `src/App.tsx`
- `src/styles.css`
- `src/demo/BaselineDemo.tsx`
- `src/demo/ShadowPortalDemo.tsx`
- `src/demo/SurfaceConflictDemo.tsx`
- `src/demo/PluginHostMenuDemo.tsx`

### `webspatial-sdk`

建议重点查看和扩展：

- `apps/test-server/src/pages/dropdown-menu-spatial/index.tsx`

## 启动方式

### `doubaodemo`

```bash
cd /Users/bytedance/github/doubaodemo
pnpm dev --host 127.0.0.1 --port 4173
```

预览地址：

- `http://127.0.0.1:4173/`

## 一句话结论

**当前最务实的路线是：先在 `doubaodemo` 中把插件宿主 + spatial surface 的结构问题抽象清楚，再把它迁移到 `webspatial-sdk` 的正式场景中验证，最后再决定需要怎样的宿主层或 SDK 层支持。**
