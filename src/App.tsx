import { useState } from "react";

import { BaselineDemo } from "./demo/BaselineDemo";
import { PluginHostMenuDemo } from "./demo/PluginHostMenuDemo";
import { ShadowPortalDemo } from "./demo/ShadowPortalDemo";
import { SurfaceConflictDemo } from "./demo/SurfaceConflictDemo";
import { appendLog } from "./demo/utils";

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    appendLog(message, setLogs);
  };

  return (
    <div className="page app-shell">
      <header className="hero">
        <h1 className="title">WebSpatial Dropdown Menu — 多场景对照 Demo</h1>
        <p className="subtitle">
          四个场景逐步展示 WebSpatial 与 Radix Dropdown Menu 的集成方式：
          主页面浮动菜单 (Scenario 1)、双 Root + SpatialOverlay (Scenario 4)、
          父 SpatialDiv 内双 Root (Scenario 5)，以及插件宿主场景。
        </p>
      </header>

      <div className="summary">
        <div className="summary-item">
          <strong>enable-xr surface</strong>
          <span>Content asChild + div enable-xr，菜单作为独立空间 surface</span>
        </div>
        <div className="summary-item">
          <strong>SpatialOverlay</strong>
          <span>
            useSpatialOverlay + portalMenuOption 注入 shadow root 的 Item
          </span>
        </div>
        <div className="summary-item">
          <strong>SpatialPortalContainer</strong>
          <span>
            useSpatialPortalContainer 把 portal 限定在父 SpatialDiv 窗口内
          </span>
        </div>
        <div className="summary-item">
          <strong>plugin host</strong>
          <span>模拟 wrapper.pico 的 list + portalMenuOption 机制</span>
        </div>
      </div>

      <div className="demo-grid">
        <BaselineDemo onLog={log} />
        <ShadowPortalDemo onLog={log} />
        <SurfaceConflictDemo onLog={log} />
        <PluginHostMenuDemo onLog={log} />
      </div>

      <section className="log-panel">
        <div className="log-panel-header">
          <h2>事件日志</h2>
          <button
            className="clear-log-btn"
            type="button"
            onClick={() => setLogs([])}
          >
            清空日志
          </button>
        </div>
        <pre className="log">
          {logs.length === 0
            ? "打开任意 demo 并点击菜单项，这里会显示 open 状态和 DOM parent 信息。"
            : logs.join("\n")}
        </pre>
      </section>
    </div>
  );
}
