# Demo Runtime Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure all demo files in `doubaodemo` remain consistent with the newly enabled WebSpatial React JSX runtime, while only changing code that is actually affected.

**Architecture:** Keep the global JSX runtime configuration in `tsconfig.json` and `vite.config.ts`, then scan every demo file for WebSpatial JSX attributes, runtime-specific typings, and behavior assumptions that may break once `jsxImportSource` points to `@webspatial/react-sdk`. Apply the smallest possible code changes, with special attention to `enable-xr` typing and any JSX props that now flow through WebSpatial's custom runtime.

**Tech Stack:** React 18, TypeScript, Vite 5, Radix Dropdown Menu, `@webspatial/react-sdk`

---

### Task 1: Audit All Demo Files Against WebSpatial JSX Runtime

**Files:**
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/BaselineDemo.tsx`
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/ShadowPortalDemo.tsx`
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/SurfaceConflictDemo.tsx`
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/PluginHostMenuDemo.tsx`
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/ShadowPortalItems.tsx`
- Verify: `/Users/bytedance/github/doubaodemo/src/App.tsx`

- [ ] **Step 1: Search for WebSpatial JSX-sensitive patterns**

Run: `grep -RInE 'enable-xr|enableXr|__enableXr__|useSpatialOverlay|useSpatialPortalContainer' /Users/bytedance/github/doubaodemo/src`
Expected: identify only the files that truly depend on WebSpatial JSX/runtime semantics.

- [ ] **Step 2: Read every demo file and classify risk**

Expected classification:

```text
BaselineDemo.tsx        -> no WebSpatial JSX props, likely no code change
ShadowPortalDemo.tsx    -> no WebSpatial JSX props, likely no code change
SurfaceConflictDemo.tsx -> no WebSpatial JSX props, likely no code change
PluginHostMenuDemo.tsx  -> uses enable-xr + useSpatialOverlay, requires validation
ShadowPortalItems.tsx   -> pure render fragment, likely no code change
App.tsx                 -> page composition only, likely no code change
```

- [ ] **Step 3: Run diagnostics before editing**

Use IDE diagnostics for the files above.
Expected: only informational spelling diagnostics or no diagnostics; no TypeScript errors should remain after the previous JSX runtime fix.

### Task 2: Apply Only The Minimal Runtime-Specific Code Fixes

**Files:**
- Modify if needed: `/Users/bytedance/github/doubaodemo/src/demo/PluginHostMenuDemo.tsx`
- Modify if needed: `/Users/bytedance/github/doubaodemo/src/demo/BaselineDemo.tsx`
- Modify if needed: `/Users/bytedance/github/doubaodemo/src/demo/ShadowPortalDemo.tsx`
- Modify if needed: `/Users/bytedance/github/doubaodemo/src/demo/SurfaceConflictDemo.tsx`
- Modify if needed: `/Users/bytedance/github/doubaodemo/src/demo/ShadowPortalItems.tsx`
- Modify if needed: `/Users/bytedance/github/doubaodemo/src/App.tsx`

- [ ] **Step 1: Keep the `enable-xr` prop boolean in `PluginHostMenuDemo.tsx`**

```tsx
<div
  className="menu-content xr-outer-content plugin-host-surface"
  enable-xr={true}
  data-name="plugin-host-surface"
>
```

Expected: satisfies `@webspatial/react-sdk` JSX typing for `BaseSpatialIntrinsic`.

- [ ] **Step 2: Do not change unrelated demo files unless audit proves they need it**

Expected result:

```text
If a file has no WebSpatial JSX attributes or runtime-specific props, leave it untouched.
```

- [ ] **Step 3: Re-run diagnostics for every demo file**

Use IDE diagnostics on:

```text
src/demo/BaselineDemo.tsx
src/demo/ShadowPortalDemo.tsx
src/demo/SurfaceConflictDemo.tsx
src/demo/PluginHostMenuDemo.tsx
src/demo/ShadowPortalItems.tsx
src/App.tsx
```

Expected: no new TypeScript diagnostics; informational cSpell warnings are acceptable.

### Task 3: Verify Build And Runtime Consistency

**Files:**
- Verify: `/Users/bytedance/github/doubaodemo/tsconfig.json`
- Verify: `/Users/bytedance/github/doubaodemo/vite.config.ts`
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/PluginHostMenuDemo.tsx`

- [ ] **Step 1: Run the full build**

Run: `pnpm build`
Expected: PASS with `tsc -b && vite build`.

- [ ] **Step 2: Restart the dev server so Vite picks up the JSX runtime config**

Run: `pnpm dev --host 127.0.0.1 --port 4173`
Expected: app serves at `http://127.0.0.1:4173/`.

- [ ] **Step 3: Confirm the consistency story**

Expected summary:

```text
Global config is unified through tsconfig + vite config.
Only PluginHostMenuDemo required a code fix because it alone used WebSpatial JSX-sensitive props.
Other demos are already consistent because they do not depend on WebSpatial JSX typing.
```
