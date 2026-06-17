import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  useSpatialOverlay,
  useSpatialPortalContainer,
} from "@webspatial/react-sdk";

import { ControlBar, DemoCard } from "./DemoCard";
import { ShadowPortalItems } from "./ShadowPortalItems";
import { type LogFn } from "./types";

/**
 * Scenario 5 — Plugin-host dual-root inside parent SpatialDiv
 *
 * Parent host is a div enable-xr. The visible menu root and plugin shadow root
 * portal into the parent spatial window, while the menu surface itself is a
 * child enable-xr surface.
 */
function SpatialPluginHostContent({ onLog }: { onLog: LogFn }) {
  const portalContainer = useSpatialPortalContainer();
  const { OverlayTarget, portalMenuOption } = useSpatialOverlay({
    portalTargetName: "surface-conflict-demo-target",
  });

  const [visibleOpen, setVisibleOpen] = useState(false);

  return (
    <>
      <ControlBar
        visibleOpen={visibleOpen}
        extra={
          <span className="state-pill shadow-pill">
            shadow root: always open
          </span>
        }
      />
      <div className="demo-stage">
        <DropdownMenu.Root
          open={visibleOpen}
          onOpenChange={(nextOpen) => {
            setVisibleOpen(nextOpen);
            onLog(`[C] visible root -> ${nextOpen ? "open" : "closed"}`);
          }}
          modal={false}
        >
          <DropdownMenu.Trigger asChild>
            <button className="trigger-btn">打开 Spatial 菜单</button>
          </DropdownMenu.Trigger>

          {portalContainer && (
            <DropdownMenu.Portal container={portalContainer}>
              <DropdownMenu.Content
                side="top"
                sideOffset={10}
                align="start"
                collisionPadding={16}
                onCloseAutoFocus={(event) => event.preventDefault()}
                asChild
              >
                <div
                  enable-xr
                  data-xr-overlay
                  className="menu-content xr-outer-content"
                  data-name="surface-conflict-menu-surface"
                >
                  <div className="content-badge">
                    Content asChild child enable-xr surface
                  </div>
                  <div className="content-hint">
                    Portal 到 useSpatialPortalContainer()（父 SpatialDiv
                    窗口）。 菜单 surface 是子 enable-xr，通过 OverlayTarget
                    接收 shadow root 的 Item。
                  </div>
                  <OverlayTarget />
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </DropdownMenu.Root>

        {portalContainer && (
          <DropdownMenu.Root open modal={false}>
            <DropdownMenu.Trigger asChild>
              <button
                className="hidden-shadow-trigger"
                aria-hidden="true"
                tabIndex={-1}
              >
                shadow trigger
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal container={portalContainer}>
              <DropdownMenu.Content className="hidden-shadow-content">
                <ShadowPortalItems
                  portalMenuOption={portalMenuOption}
                  sourceLabel="shadow root -> child enable-xr surface"
                  onLog={onLog}
                />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </>
  );
}

/**
 * Scenario 5 wrapper — parent div enable-xr provides the spatial context.
 */
export function SurfaceConflictDemo({ onLog }: { onLog: LogFn }) {
  return (
    <DemoCard
      title="C. 父 SpatialDiv 内双 Root (Scenario 5)"
      description="外层 div enable-xr 提供空间上下文。可见 root 和 shadow root 都 portal 到 useSpatialPortalContainer()，菜单 surface 是子 enable-xr。"
    >
      <div
        enable-xr
        style={{
          minHeight: "300px",
          outline: "2px dashed rgba(56, 189, 248, 0.5)",
          outlineOffset: "-2px",
          borderRadius: "14px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
        data-name="surface-conflict-spatial-parent"
      >
        <SpatialPluginHostContent onLog={onLog} />
      </div>
    </DemoCard>
  );
}
