import { type CSSProperties } from "react";

import { ContentModal } from "./ContentModal";
import { ModalHeader } from "./ModalHeader";
import { type ContentModalConfig } from "./types";

const aboutSurfaceStyle = {
  "--xr-back": "50px",
  "--xr-background-material": "thick",
} as CSSProperties;

export function AboutModal({
  visible,
  contentModalConfig,
  onClose,
  openContentModal,
  closeContentModal,
}: {
  visible: boolean;
  contentModalConfig: ContentModalConfig | null;
  onClose: () => void;
  openContentModal: (config: ContentModalConfig) => void;
  closeContentModal: () => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="modal-layer about-modal-layer">
        <div
          className="about-modal-surface"
          enable-xr={true}
          style={aboutSurfaceStyle}
        >
          <ModalHeader title="关于豆包" onClose={onClose} />
          <div className="about-modal-body">
            <div className="about-product-block">
              <div className="about-product-logo">豆</div>
              <div>
                <div className="about-product-name">豆包</div>
                <div className="about-product-version">Version 1.0.0 demo</div>
              </div>
            </div>

            <div className="about-action-list">
              <button
                className="about-action-row"
                type="button"
                onClick={() =>
                  openContentModal({
                    title: "联系我们",
                    emailText: "feedback@mail.doubao.com",
                  })
                }
              >
                <span>联系我们</span>
                <span className="about-action-arrow">›</span>
              </button>
              <a
                className="about-action-row"
                href="https://www.doubao.com/legal/terms"
                target="_blank"
                rel="noreferrer"
              >
                <span>服务协议</span>
                <span className="about-action-arrow">›</span>
              </a>
              <a
                className="about-action-row"
                href="https://www.doubao.com/legal/privacy"
                target="_blank"
                rel="noreferrer"
              >
                <span>隐私政策</span>
                <span className="about-action-arrow">›</span>
              </a>
              <button
                className="about-action-row"
                type="button"
                onClick={() =>
                  openContentModal({
                    title: "版权投诉",
                    emailText: "jubao@mail.doubao.com",
                  })
                }
              >
                <span>版权投诉</span>
                <span className="about-action-arrow">›</span>
              </button>
            </div>

            <div className="about-modal-footer">
              <span>京ICP备2023020373号-1</span>
            </div>
          </div>
        </div>
      </div>

      <ContentModal config={contentModalConfig} onCancel={closeContentModal} />
    </>
  );
}
