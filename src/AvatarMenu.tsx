import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

/**
 * 仿 dbx-ui avatar-popover-menu 的最小 demo：
 * - Root: 受控开关 open / onOpenChange
 * - Trigger asChild: 把 trigger 行为绑到自定义头像按钮
 * - Portal container={#root}: 把弹层挂到 #root，避免父级 overflow / transform 截断
 * - Content: side / align / sideOffset / collisionPadding / onCloseAutoFocus
 * - Item.onSelect: 处理点击 + 键盘选中
 * - Label / Separator: 分组分隔
 */
export function AvatarMenu({
  onLog,
}: {
  onLog: (msg: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    onLog('clicked: 登录 / 注册');
  };

  const handleAbout = () => {
    onLog('clicked: 关于豆包');
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="avatar-btn" aria-label="user-menu">
          <img
            className="avatar-img"
            src="https://picsum.photos/seed/doubao/96/96"
            alt="avatar"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal
        container={document.getElementById('root') ?? undefined}
      >
        <DropdownMenu.Content
          className="menu-content"
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenu.Label className="menu-label">未登录</DropdownMenu.Label>

          <DropdownMenu.Item className="menu-item" onSelect={handleLogin}>
            登录 / 注册
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="menu-separator" />

          <DropdownMenu.Item className="menu-item" onSelect={handleAbout}>
            关于豆包
          </DropdownMenu.Item>

          <DropdownMenu.Item className="menu-item" disabled>
            设置（未登录不可用）
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
