# Plugin Host Menu WebSpatial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch `doubaodemo`'s plugin-host menu demo from manual `createPortal()` wiring to PR `1231` WebSpatial SDK packages and mirror the `Scenario4PluginHostMenu` structure.

**Architecture:** Add `@webspatial/core-sdk` and `@webspatial/react-sdk` from `pkg.pr.new`, then rewrite `PluginHostMenuDemo` to use `useSpatialOverlay()` for the portal injection contract. Keep the visible-root plus shadow-root experiment shape and existing logging/plugin toggles, while removing manual outer/inner target state and making the visible menu surface the Radix content node via `asChild`.

**Tech Stack:** React 18, TypeScript, Vite 5, Radix Dropdown Menu, `@webspatial/react-sdk`, `@webspatial/core-sdk`

---

### Task 1: Add PR SDK Dependencies

**Files:**
- Modify: `/Users/bytedance/github/doubaodemo/package.json`
- Modify: `/Users/bytedance/github/doubaodemo/pnpm-lock.yaml`

- [ ] **Step 1: Update `package.json` dependencies**

```json
{
  "dependencies": {
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@webspatial/core-sdk": "https://pkg.pr.new/@webspatial/core-sdk@16122cc",
    "@webspatial/react-sdk": "https://pkg.pr.new/@webspatial/react-sdk@16122cc",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

- [ ] **Step 2: Install dependencies and refresh lockfile**

Run: `pnpm install`
Expected: install completes successfully and `pnpm-lock.yaml` records the two `pkg.pr.new` packages.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add webspatial pr packages"
```

### Task 2: Rewrite The Demo To Use `useSpatialOverlay`

**Files:**
- Modify: `/Users/bytedance/github/doubaodemo/src/demo/PluginHostMenuDemo.tsx`

- [ ] **Step 1: Replace manual portal imports and types**

```tsx
import { useSpatialOverlay, type SpatialOverlayPortalOption } from "@webspatial/react-sdk";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useCallback, useMemo, useState } from "react";
```

- [ ] **Step 2: Replace the portal render props contract**

```tsx
type PluginRenderProps = {
  closeMenu: () => void;
  menuVisible: boolean;
  portalMenuOption: SpatialOverlayPortalOption;
};
```

- [ ] **Step 3: Keep plugin toggles but simplify menu item rendering**

```tsx
return props.portalMenuOption(
  <DropdownMenu.Item
    className="menu-item"
    data-name={`plugin-item-${identifier}`}
    onSelect={() => {
      onLog(`[PluginHost] select ${identifier} (menuVisible=${props.menuVisible})`);
      props.closeMenu();
    }}
  >
    <span className="origin-tag shadow">plugin</span>
    <span>{labelMap[identifier]}</span>
  </DropdownMenu.Item>,
);
```

- [ ] **Step 4: Remove manual target state and initialize the overlay hook**

```tsx
const { OverlayTarget, portalMenuOption } = useSpatialOverlay({
  portalTargetName: "doubaodemo-plugin-host-menu-target",
});

const [visibleOpen, setVisibleOpen] = useState(false);
const [enableDrive, setEnableDrive] = useState(false);
const [enableScreenshot, setEnableScreenshot] = useState(false);
const portalContainer = getPortalContainer();

const closeMenu = useCallback(() => {
  setVisibleOpen(false);
}, []);
```

- [ ] **Step 5: Replace the visible content shell with `Content asChild` spatial surface**

```tsx
<DropdownMenu.Portal container={portalContainer}>
  <DropdownMenu.Content
    side="top"
    sideOffset={10}
    align="start"
    collisionPadding={16}
    onCloseAutoFocus={(event) => {
      onLog("[PluginHost] visible content close auto focus");
      event.preventDefault();
    }}
    asChild
  >
    <div
      className="menu-content xr-outer-content plugin-host-surface"
      enable-xr=""
      data-name="plugin-host-surface"
    >
      <div className="content-badge">Visible Content / plugin host</div>
      <div className="content-hint" data-name="plugin-host-surface-note">
        Content asChild + enable-xr surface，插件项通过 WebSpatial overlay 注入到这个 surface。
      </div>
      <OverlayTarget />
    </div>
  </DropdownMenu.Content>
</DropdownMenu.Portal>
```

- [ ] **Step 6: Keep the always-open shadow root and inject plugin items through `portalMenuOption`**

```tsx
<DropdownMenu.Root open modal={false}>
  <DropdownMenu.Trigger asChild>
    <button className="hidden-shadow-trigger" aria-hidden="true" tabIndex={-1}>
      plugin host shadow trigger
    </button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal container={portalContainer}>
    <DropdownMenu.Content className="hidden-shadow-content">
      <DropdownMenu.Label className="menu-label">
        shadow root 遍历插件列表
      </DropdownMenu.Label>
      {pluginList.map((identifier) => (
        <PluginMenuOptionItem
          key={identifier}
          identifier={identifier}
          enableDrive={enableDrive}
          enableScreenshot={enableScreenshot}
          onLog={onLog}
          closeMenu={closeMenu}
          menuVisible={visibleOpen}
          portalMenuOption={portalMenuOption}
        />
      ))}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

- [ ] **Step 7: Remove obsolete state and helpers**

Delete:

```tsx
const [outerTarget, setOuterTarget] = useState<HTMLDivElement | null>(null);
const [innerTarget, setInnerTarget] = useState<HTMLDivElement | null>(null);
const [targetMode, setTargetMode] = useState<TargetMode>("outer");
const currentTarget = targetMode === "outer" ? outerTarget : innerTarget;
const portalMenuOption = (content: ReactNode) =>
  visibleOpen && currentTarget ? createPortal(content, currentTarget) : null;
```

- [ ] **Step 8: Run a focused build**

Run: `pnpm build`
Expected: Vite build succeeds with the new WebSpatial imports and no TypeScript errors from `PluginHostMenuDemo.tsx`.

- [ ] **Step 9: Commit**

```bash
git add src/demo/PluginHostMenuDemo.tsx
git commit -m "feat: align plugin host demo with webspatial overlay"
```

### Task 3: Adjust Styling For The New Surface

**Files:**
- Modify: `/Users/bytedance/github/doubaodemo/src/styles.css`

- [ ] **Step 1: Add a dedicated surface class for the Scenario 4-like shell**

```css
.plugin-host-surface {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

- [ ] **Step 2: Keep the current hidden shadow behavior**

```css
.hidden-shadow-content {
  pointer-events: none;
  opacity: 0;
  position: absolute;
  inset: 0;
}
```

Expected: no behavioral change to the hidden shadow root while the visible shell gains stable layout for `OverlayTarget`.

- [ ] **Step 3: Run a focused build**

Run: `pnpm build`
Expected: build still passes and generated CSS includes `.plugin-host-surface`.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css
git commit -m "style: refine plugin host spatial surface"
```

### Task 4: Verify Behavior

**Files:**
- Verify: `/Users/bytedance/github/doubaodemo/src/demo/PluginHostMenuDemo.tsx`
- Verify: `/Users/bytedance/github/doubaodemo/package.json`

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev --host 127.0.0.1 --port 4173`
Expected: Vite serves the app at `http://127.0.0.1:4173/`.

- [ ] **Step 2: Manual behavior check**

Verify these actions in the browser:

```text
1. Open "D. Plugin Host 场景"
2. Click "打开插件宿主菜单"
3. Confirm the visible menu shell renders as one spatial surface
4. Confirm only upload is visible by default
5. Toggle Drive / Screenshot and confirm extra menu items appear
6. Select one plugin item and confirm the menu closes plus logs update
```

- [ ] **Step 3: Final validation build**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/demo/PluginHostMenuDemo.tsx src/styles.css
git commit -m "feat: integrate webspatial overlay plugin host demo"
```
