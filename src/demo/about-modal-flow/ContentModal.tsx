import { type CSSProperties } from "react";

import { ModalHeader } from "./ModalHeader";
import { type ContentModalConfig } from "./types";

const contentSurfaceStyle = {
  "--xr-back": "100px",
  "--xr-background-material": "thick",
} as CSSProperties;

export function ContentModal({
  config,
  onCancel,
}: {
  config: ContentModalConfig | null;
  onCancel: () => void;
}) {
  if (!config) {
    return null;
  }

  return (
    <div className="modal-layer content-modal-layer">
      <div
        className="common-content-modal"
        enable-xr={true}
        style={contentSurfaceStyle}
      >
        <ModalHeader
          title={config.title}
          onClose={onCancel}
          hideCloseButton
        />
        <div className="common-content-modal-body">
          将相关材料发送到邮箱：
          <span className="common-content-modal-mail">{config.emailText}</span>
          ，我们会尽快处理
        </div>
        <div className="common-content-modal-actions">
          <button
            className="common-content-modal-confirm"
            type="button"
            onClick={onCancel}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
