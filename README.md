# doubaodemo

A Vite + React demo for validating integration patterns between WebSpatial and Radix Dropdown Menu. The project compares four scenarios that show how menu content can be rendered as a spatial surface, and how plugin-owned menu items can be injected from a separate Radix root into the visible menu layer.

## Background

This demo focuses on the following questions:

- How Radix `DropdownMenu.Content` can be combined with `asChild` and `enable-xr` to become a WebSpatial surface.
- How multiple Radix roots can share one visible menu layer through `useSpatialOverlay` and `portalMenuOption`.
- How menu portals behave differently on a normal page versus inside a parent `SpatialDiv` spatial window.
- How a plugin host can keep the visible menu surface separate from plugin-owned menu item logic.

## Getting Started

```bash
pnpm install
pnpm dev
```

The dev server runs at:

```text
http://127.0.0.1:5179
```

Build the production bundle:

```bash
pnpm build
```

Preview the production bundle:

```bash
pnpm preview
```

## Demo Scenarios

### A. Main Page Floating Menu

Source: [src/demo/BaselineDemo.tsx](src/demo/BaselineDemo.tsx)

A single Radix root portals `DropdownMenu.Content` into the page root. The content uses `asChild` to wrap a `div` with `enable-xr`, so the menu content becomes an independent WebSpatial surface floating above the main page.

### B. Dual Root + SpatialOverlay

Source: [src/demo/ShadowPortalDemo.tsx](src/demo/ShadowPortalDemo.tsx)

The visible root owns the trigger and visible menu surface, while the shadow root stays open and owns plugin item logic. Items from the shadow root are injected into the visible surface's `OverlayTarget` through `portalMenuOption`.

### C. Dual Root Inside Parent SpatialDiv

Source: [src/demo/SurfaceConflictDemo.tsx](src/demo/SurfaceConflictDemo.tsx)

An outer `div enable-xr` provides the parent spatial context. Both the visible root and the shadow root portal into the parent spatial window returned by `useSpatialPortalContainer()`. The menu itself remains a child `enable-xr` surface.

### D. Plugin Host Scenario

Source: [src/demo/PluginHostMenuDemo.tsx](src/demo/PluginHostMenuDemo.tsx)

This scenario is closer to a real plugin host. The host renders the visible menu surface, while the plugin side produces menu items from a candidate list. Plugin items are injected into the host menu through WebSpatial overlay, and they can call the host-provided `closeMenu` callback after selection.

## Key Implementation Details

- The Vite React plugin sets `jsxImportSource: "@webspatial/react-sdk"` to enable the WebSpatial JSX runtime.
- `tsconfig.json` uses the same `jsxImportSource` so TypeScript compilation matches Vite's JSX transform.
- `@webspatial/react-sdk` and `@webspatial/core-sdk` currently point to `pkg.pr.new` preview packages, which makes it possible to validate WebSpatial overlay changes before they are published as stable npm versions.
- The event log at the bottom of the page records menu open state, plugin toggles, and menu item DOM parent information, making it easier to inspect the actual portal and overlay mount locations.

## Project Structure

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

## Related Docs

- [RADIX_WEBSPATIAL_RECOMMENDATIONS.md](RADIX_WEBSPATIAL_RECOMMENDATIONS.md): integration recommendations for Radix and WebSpatial.
- [docs/superpowers/plans/2026-06-16-demo-runtime-consistency-plan.md](docs/superpowers/plans/2026-06-16-demo-runtime-consistency-plan.md): demo runtime consistency plan.
- [docs/superpowers/plans/2026-06-16-plugin-host-menu-webspatial-plan.md](docs/superpowers/plans/2026-06-16-plugin-host-menu-webspatial-plan.md): plugin host menu integration plan for WebSpatial.
