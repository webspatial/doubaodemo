import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type SpatialOverlayPortalOption } from "@webspatial/react-sdk";

import { type LogFn } from "./types";
import { getParentLabel } from "./utils";

export function ShadowPortalItems({
  portalMenuOption,
  sourceLabel,
  onLog,
}: {
  portalMenuOption: SpatialOverlayPortalOption;
  sourceLabel: string;
  onLog: LogFn;
}) {
  return (
    <>
      {portalMenuOption(
        <DropdownMenu.Label className="menu-label">
          {sourceLabel}
        </DropdownMenu.Label>,
      )}
      {portalMenuOption(
        <DropdownMenu.Item
          className="menu-item"
          onSelect={(event) => {
            onLog(
              `[B/C] 选择 Shadow Item 1，DOM parent = ${getParentLabel(
                event.currentTarget as HTMLElement,
              )}`,
            );
          }}
        >
          <span className="origin-tag shadow">shadow root</span>
          <span>来自 shadow root 的 Item 1</span>
        </DropdownMenu.Item>,
      )}
      {portalMenuOption(
        <DropdownMenu.Item
          className="menu-item"
          onSelect={(event) => {
            onLog(
              `[B/C] 选择 Shadow Item 2，DOM parent = ${getParentLabel(
                event.currentTarget as HTMLElement,
              )}`,
            );
          }}
        >
          <span className="origin-tag shadow">shadow root</span>
          <span>来自 shadow root 的 Item 2</span>
        </DropdownMenu.Item>,
      )}
    </>
  );
}
