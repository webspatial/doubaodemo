import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  useSpatialOverlay,
  type SpatialOverlayPortalOption,
} from "@webspatial/react-sdk";
import { useCallback, useMemo, useState } from "react";

import { ControlBar, DemoCard } from "./DemoCard";
import { type LogFn } from "./types";

type PluginIdentifier = "drive" | "screenshot" | "upload";

const PLUGIN_LIST: readonly PluginIdentifier[] = [
  "drive",
  "screenshot",
  "upload",
];

const PLUGIN_LABELS: Record<PluginIdentifier, string> = {
  drive: "云盘文件",
  screenshot: "截图提问",
  upload: "上传文件或图片",
};

type PluginRenderProps = {
  closeMenu: () => void;
  menuVisible: boolean;
  portalMenuOption: SpatialOverlayPortalOption;
};

function PluginMenuOptionItem({
  identifier,
  enableDrive,
  enableScreenshot,
  onLog,
  ...props
}: PluginRenderProps & {
  identifier: PluginIdentifier;
  enableDrive: boolean;
  enableScreenshot: boolean;
  onLog: LogFn;
}) {
  if (identifier === "drive" && !enableDrive) {
    return null;
  }

  if (identifier === "screenshot" && !enableScreenshot) {
    return null;
  }

  return props.portalMenuOption(
    <DropdownMenu.Item
      className="menu-item"
      data-name={`plugin-item-${identifier}`}
      onSelect={() => {
        onLog(
          `[PluginHost] select ${identifier} (menuVisible=${props.menuVisible})`,
        );
        props.closeMenu();
      }}
    >
      <span className="origin-tag shadow">plugin</span>
      <span>{PLUGIN_LABELS[identifier]}</span>
    </DropdownMenu.Item>,
  );
}

export function PluginHostMenuDemo({ onLog }: { onLog: LogFn }) {
  const portalContainer = useMemo(
    () => (typeof document === "undefined" ? null : document.body),
    [],
  );
  const { OverlayTarget, portalMenuOption } = useSpatialOverlay({
    portalTargetName: "doubaodemo-plugin-host-menu-target",
  });
  const [visibleOpen, setVisibleOpen] = useState(false);
  const [enableDrive, setEnableDrive] = useState(false);
  const [enableScreenshot, setEnableScreenshot] = useState(false);

  const closeMenu = useCallback(() => {
    setVisibleOpen(false);
  }, []);

  const renderProps: PluginRenderProps = useMemo(
    () => ({
      closeMenu,
      menuVisible: visibleOpen,
      portalMenuOption,
    }),
    [closeMenu, portalMenuOption, visibleOpen],
  );

  return (
    <DemoCard
      title="D. Plugin Host 场景"
      description="贴近真实 plugin host：visible root 负责展示菜单 surface，shadow root 承载插件项逻辑；插件项通过 WebSpatial overlay 注入到空间菜单。"
    >
      <ControlBar
        visibleOpen={visibleOpen}
        extra={
          <>
            <span className="state-pill shadow-pill">
              candidates: {PLUGIN_LIST.join(", ")}
            </span>
            <span className="state-pill">
              visible items:{" "}
              {1 + Number(enableDrive) + Number(enableScreenshot)}
            </span>
          </>
        }
      />

      <div className="plugin-control-panel">
        <div className="mode-toggle" role="group" aria-label="plugin toggles">
          <button
            className={enableDrive ? "mode-btn active" : "mode-btn"}
            onClick={() => {
              setEnableDrive((prev) => !prev);
              onLog(`[PluginHost] drive plugin -> ${!enableDrive}`);
            }}
            type="button"
          >
            Drive 插件
          </button>
          <button
            className={enableScreenshot ? "mode-btn active" : "mode-btn"}
            onClick={() => {
              setEnableScreenshot((prev) => !prev);
              onLog(`[PluginHost] screenshot plugin -> ${!enableScreenshot}`);
            }}
            type="button"
          >
            Screenshot 插件
          </button>
        </div>
      </div>

      <div className="plugin-note">
        这个版本直接消费 PR `1231` 的 WebSpatial overlay 能力：visible root
        提供空间 surface，shadow root 里的插件项通过 `portalMenuOption`
        注入进去。默认状态下，只有 `upload` 会产出可见菜单项。
      </div>

      <div className="demo-stage">
        <DropdownMenu.Root
          open={visibleOpen}
          onOpenChange={(nextOpen) => {
            setVisibleOpen(nextOpen);
            onLog(
              `[PluginHost] visible root -> ${nextOpen ? "open" : "closed"}`,
            );
          }}
          modal={false}
        >
          <DropdownMenu.Trigger asChild>
            <button
              className="trigger-btn"
              onBlur={(event) => {
                const nextTarget = event.relatedTarget as HTMLElement | null;
                onLog(
                  `[PluginHost] trigger blur -> ${
                    nextTarget?.dataset.name ??
                    nextTarget?.textContent?.trim() ??
                    nextTarget?.tagName ??
                    "null"
                  }`,
                );
              }}
            >
              打开插件宿主菜单
            </button>
          </DropdownMenu.Trigger>

          {portalContainer && (
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
                onEscapeKeyDown={() => {
                  onLog("[PluginHost] visible content escape key down");
                }}
                asChild
              >
                <div
                  className="menu-content xr-outer-content plugin-host-surface"
                  enable-xr={true}
                  data-name="plugin-host-surface"
                >
                  <div className="content-badge">
                    Visible Content / plugin host
                  </div>
                  <div
                    className="content-hint"
                    data-name="plugin-host-surface-note"
                  >
                    Content asChild + enable-xr surface，shadow root 插件项通过
                    WebSpatial overlay 注入到这个空间菜单层。
                  </div>
                  <div className="surface-hint">
                    不再手动切换 outer / inner target，直接对齐 Scenario 4 的
                    plugin host overlay 结构。
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
                plugin host shadow trigger
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal container={portalContainer}>
              <DropdownMenu.Content
                className="hidden-shadow-content"
                onEscapeKeyDown={() => {
                  onLog("[PluginHost] shadow content escape key down");
                }}
              >
                <DropdownMenu.Label className="menu-label">
                  shadow root 遍历插件列表
                </DropdownMenu.Label>
                {PLUGIN_LIST.map((identifier) => (
                  <PluginMenuOptionItem
                    key={identifier}
                    identifier={identifier}
                    enableDrive={enableDrive}
                    enableScreenshot={enableScreenshot}
                    onLog={onLog}
                    {...renderProps}
                  />
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </DemoCard>
  );
}
