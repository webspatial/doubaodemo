import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type CSSProperties, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { AboutModal } from "./about-modal-flow/AboutModal";
import { type ContentModalConfig } from "./about-modal-flow/types";
import { ControlBar, DemoCard } from "./DemoCard";
import { type LogFn } from "./types";

export function AboutModalFlowDemo({ onLog }: { onLog: LogFn }) {
  const portalContainer = useMemo(
    () => (typeof document === "undefined" ? null : document.body),
    [],
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contentModalConfig, setContentModalConfig] =
    useState<ContentModalConfig | null>(null);

  const openAbout = () => {
    onLog("[AboutFlow] about menu item selected");
    setMenuOpen(false);
    setAboutOpen(true);
  };

  const closeAbout = () => {
    onLog("[AboutFlow] close about modal");
    setAboutOpen(false);
    setContentModalConfig(null);
  };

  const openContentModal = (config: ContentModalConfig) => {
    onLog(`[AboutFlow] open content modal: ${config.title}`);
    setContentModalConfig(config);
  };

  const closeContentModal = () => {
    onLog("[AboutFlow] close content modal");
    setContentModalConfig(null);
  };

  return (
    <DemoCard
      title="E. 关于豆包二级弹窗链路"
      description="抽象 flow-web-monorepo 未登录头像菜单：点击关于豆包后关闭菜单并打开主弹窗，主弹窗内的 action item 再通过 contentModalConfig 打开二级弹窗。"
    >
      <ControlBar
        visibleOpen={menuOpen}
        extra={
          <>
            <span className={aboutOpen ? "state-pill open" : "state-pill"}>
              about modal: {aboutOpen ? "open" : "closed"}
            </span>
            <span
              className={contentModalConfig ? "state-pill open" : "state-pill"}
            >
              content modal: {contentModalConfig ? "open" : "closed"}
            </span>
          </>
        }
      />

      <div className="plugin-note">
        这个 demo 对应 GuestAvatarPopoverMenuTop + GuestAboutEntry +
        ContentModal：菜单项只负责切换状态，主弹窗和二级弹窗分别用不同
        `--xr-back` 模拟浮起层级。
      </div>

      <div className="demo-stage about-demo-stage">
        <DropdownMenu.Root
          open={menuOpen}
          onOpenChange={(open) => {
            setMenuOpen(open);
            onLog(
              `[AboutFlow] guest avatar menu -> ${open ? "open" : "closed"}`,
            );
          }}
          modal={false}
        >
          <DropdownMenu.Trigger asChild>
            <button className="guest-avatar-trigger" type="button">
              <span className="guest-avatar-icon">豆</span>
              <span>未登录头像菜单</span>
            </button>
          </DropdownMenu.Trigger>

          {portalContainer && (
            <DropdownMenu.Portal container={portalContainer}>
              <DropdownMenu.Content
                side="bottom"
                align="start"
                sideOffset={8}
                collisionPadding={16}
                className="menu-content about-menu-content"
                onCloseAutoFocus={(event) => event.preventDefault()}
                asChild
              >
                <div
                  enable-xr={true}
                  style={{ "--xr-back": 10 } as CSSProperties}
                >
                  <DropdownMenu.Item
                    className="menu-item"
                    data-name="about-doubao-item"
                    onSelect={openAbout}
                  >
                    <span className="about-menu-icon">ⓘ</span>
                    <span>关于豆包</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="menu-separator" />
                  <DropdownMenu.Item
                    className="menu-item about-login-item"
                    onSelect={() => onLog("[AboutFlow] login selected")}
                  >
                    <span className="about-menu-icon">●</span>
                    <span>登录</span>
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </DropdownMenu.Root>

        {portalContainer &&
          createPortal(
            <AboutModal
              visible={aboutOpen}
              contentModalConfig={contentModalConfig}
              onClose={closeAbout}
              openContentModal={openContentModal}
              closeContentModal={closeContentModal}
            />,
            portalContainer,
          )}
      </div>
    </DemoCard>
  );
}
