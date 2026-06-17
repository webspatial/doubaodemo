import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { ControlBar, DemoCard } from "./DemoCard";
import { type LogFn } from "./types";
import { getParentLabel, getPortalContainer } from "./utils";

import { enableDebugTool } from "@webspatial/react-sdk";

enableDebugTool();

/**
 * Scenario 1 — Main page floating menu
 *
 * Portal to document.body, Content asChild with inner div enable-xr.
 * The menu surface becomes a spatial surface via WebSpatial JSX runtime.
 */
export function BaselineDemo({ onLog }: { onLog: LogFn }) {
  const [open, setOpen] = useState(false);
  const portalContainer = getPortalContainer();

  return (
    <DemoCard
      title="A. 主页面浮动菜单 (Scenario 1)"
      description="Portal 到 document.body，Content asChild + 内层 div enable-xr。菜单作为独立空间 surface 浮在主页面之上。"
    >
      <ControlBar visibleOpen={open} />
      <div className="demo-stage">
        <DropdownMenu.Root
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            onLog(`[A] visible root -> ${nextOpen ? "open" : "closed"}`);
          }}
        >
          <DropdownMenu.Trigger asChild>
            <button className="trigger-btn">打开浮动菜单</button>
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
                  className="menu-content baseline-content"
                  data-name="baseline-menu-surface"
                  style={{ "--xr-back": 100 }}
                >
                  <div className="content-badge">
                    Content asChild enable-xr surface
                  </div>
                  <DropdownMenu.Label className="menu-label">
                    单 root
                  </DropdownMenu.Label>
                  <DropdownMenu.Item
                    className="menu-item"
                    onSelect={(event) => {
                      onLog(
                        `[A] 选择 Item 1，DOM parent = ${getParentLabel(
                          event.currentTarget as HTMLElement,
                        )}`,
                      );
                    }}
                  >
                    <span className="origin-tag">same root</span>
                    <span>普通 Item 1</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="menu-item"
                    onSelect={(event) => {
                      onLog(
                        `[A] 选择 Item 2，DOM parent = ${getParentLabel(
                          event.currentTarget as HTMLElement,
                        )}`,
                      );
                    }}
                  >
                    <span className="origin-tag">same root</span>
                    <span>普通 Item 2</span>
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </DropdownMenu.Root>
      </div>
    </DemoCard>
  );
}
