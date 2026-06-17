import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSpatialOverlay } from '@webspatial/react-sdk';

import { ControlBar, DemoCard } from './DemoCard';
import { ShadowPortalItems } from './ShadowPortalItems';
import { type LogFn } from './types';
import { getPortalContainer } from './utils';

/**
 * Scenario 4 — Plugin-host dual-root menu (flat page)
 *
 * Visible root owns the menu shell with enable-xr surface.
 * Shadow root owns plugin items, injected via portalMenuOption.
 */
export function ShadowPortalDemo({ onLog }: { onLog: LogFn }) {
  const [visibleOpen, setVisibleOpen] = useState(false);
  const portalContainer = getPortalContainer();
  const { OverlayTarget, portalMenuOption } = useSpatialOverlay({
    portalTargetName: 'shadow-portal-demo-target',
  });

  return (
    <DemoCard
      title="B. 双 Root + SpatialOverlay (Scenario 4)"
      description="可见 root 负责菜单壳子 (enable-xr surface)，shadow root 负责插件项。portalMenuOption 把 shadow 里的 Item 注入到可见 surface 的 OverlayTarget 中。"
    >
      <ControlBar
        visibleOpen={visibleOpen}
        extra={<span className="state-pill shadow-pill">shadow root: always open</span>}
      />
      <div className="demo-stage">
        <DropdownMenu.Root
          open={visibleOpen}
          onOpenChange={(nextOpen) => {
            setVisibleOpen(nextOpen);
            onLog(`[B] visible root -> ${nextOpen ? 'open' : 'closed'}`);
          }}
          modal={false}
        >
          <DropdownMenu.Trigger asChild>
            <button className="trigger-btn">打开双 Root 菜单</button>
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
                  className="menu-content portal-host-content"
                  data-name="shadow-portal-demo-surface"
                >
                  <div className="content-badge">Content asChild enable-xr surface</div>
                  <div className="content-hint" data-name="visible-content-target">
                    Visible root 的 Content，通过 OverlayTarget 接收 shadow root 的 Item。
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
                  sourceLabel="逻辑上属于 shadow root"
                  onLog={onLog}
                />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </DemoCard>
  );
}
