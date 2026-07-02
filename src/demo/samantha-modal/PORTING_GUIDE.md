# SamanthaModal 移植指南

## 概述

本目录是 flow-web-monorepo 中 `samantha-modal` 的镜像实现，用于在开源环境中验证 WebSpatial SDK 集成。验证通过后，可按以下步骤快速移植回 monorepo。

## 文件结构对照

| doubaodemo 文件 | monorepo 文件 | 状态 |
|----------------|---------------|------|
| `index.ts` | `index.ts` | ✅ 完全一致 |
| `type.ts` | `type.ts` | ⚠️ 导入路径不同 |
| `modal.tsx` | `modal.tsx` | ⚠️ 组件/图标/样式不同 |
| `modal.module.css` | `modal.module.less` | ⚠️ 格式不同 (CSS → LESS) |
| `confirm.tsx` | `confirm.tsx` | ⚠️ 图标不同 |
| `confirm-modal.tsx` | `confirm-modal.tsx` | ✅ 基本一致 |
| `pico-confirm-modal.ts` | `pico-confirm-modal.ts` | ⚠️ selectByPico 实现不同 |
| `destroy.ts` | `destroy.ts` | ✅ 完全一致 |
| `use-loading.ts` | `use-loading.ts` | ✅ 完全一致 |

## 移植步骤

### 1. type.ts

替换导入：

```tsx
// 删除这些
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal/Modal';
type ButtonProps = Record<string, unknown>;

// 替换为
import { ModalReactProps } from '@flow-web/l1-arch-base-samantha-ui-base/modal/index.js';
import { ButtonProps } from '../samantha-button';
```

### 2. modal.tsx

替换导入和组件：

```tsx
// 删除这些
import { isUndefined } from 'lodash-es';
import clsx from 'clsx';
import { Modal, Button, LocaleConsumer } from '@douyinfe/semi-ui';
import IconClose from '@douyinfe/semi-icons/lib/es/icons/IconClose';
const SamanthaButton = Button;
import styles from './modal.module.css';

// 替换为
import { isUndefined } from 'lodash-es';
import cls from 'classnames';
import {
  Modal,
  IconButton,
  LocaleConsumer,
} from '@flow-web/l1-arch-base-samantha-ui-base';
import { IconCloseIcon } from '@flow-web/l1-arch-base-samantha-icons';
import { SamanthaButton } from '../samantha-button';
import styles from './modal.module.less';
```

替换 `renderCloseIcon` 中的 `Button` 为 `IconButton`：

```tsx
// 删除 Button 版本
// 替换为 IconButton 版本 (TODO 注释中有完整代码)
```

替换 `closeIcon` 默认值：

```tsx
closeIcon: <IconCloseIcon className="text-s-color-text-tertiary" />,
```

### 3. confirm.tsx

替换图标导入：

```tsx
// 删除这些
import IconInfoCircle from '@douyinfe/semi-icons/lib/es/icons/IconInfoCircle';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import IconAlertCircle from '@douyinfe/semi-icons/lib/es/icons/IconAlertCircle';
import IconCrossCircleStroked from '@douyinfe/semi-icons/lib/es/icons/IconCrossCircleStroked';

// 替换为
import {
  IconInfoFillIcon,
  IconSuccessSmallIcon,
  IconWarningSmallIcon,
  IconErrorSmallIcon,
} from '@flow-web/l1-arch-base-samantha-icons';
```

替换各 `withXxx` 函数中的图标：

- `withInfo/withConfirm`: `IconInfoCircle` → `IconInfoFillIcon`
- `withSuccess`: `IconTickCircle` → `IconSuccessSmallIcon`
- `withWarning`: `IconAlertCircle` → `IconWarningSmallIcon`
- `withError`: `IconCrossCircleStroked` → `IconErrorSmallIcon`

替换按钮类型：
- `type: 'danger'` → `type: 'danger-primary'`

### 4. confirm-modal.tsx

替换导入：

```tsx
// 删除
import clsx from 'clsx';

// 替换为
import cls from 'classnames';
```

恢复 `x-semi-prop` 属性：
```tsx
<div className={contentCls} x-semi-prop="content">
```

### 5. pico-confirm-modal.ts

替换导入：

```tsx
// 删除
const IS_PICO = false;
const selectByPico = <T,>(picoValue: T, defaultValue: T): T =>
  IS_PICO ? picoValue : defaultValue;

// 替换为
import { selectByPico } from '@flow-web/l1-arch-base-utils';
```

### 6. modal.module.css → modal.module.less

将 CSS 文件转换为 LESS，恢复 `:global` 语法和 Pico 相关样式（参考 monorepo 中的 `modal.module.less`）。

## WebSpatial 集成验证点

移植前，确保以下 WebSpatial 相关验证已通过：

1. **Modal 的空间化渲染**
   - `enable-xr` marker 是否正确添加
   - `--xr-back` 厚度设置是否生效
   - `--xr-background-material` 材质设置是否生效

2. **命令式 API 的空间化**
   - `SamanthaModal.warning()` 创建的弹窗是否正确空间化
   - `ReactDOM.render` 到 body 的节点是否被正确识别

3. **Portal 渲染**
   - Modal Portal 到 body 的节点是否在 Spatial 树中正确
   - 多层 Modal 叠加时的层级关系

4. **动画兼容**
   - CSSAnimation 进出场动画是否与空间化兼容
   - 焦点陷阱 (focus trap) 是否正常工作

## 验证命令

```bash
# doubaodemo 中验证
cd /Users/bytedance/github/doubaodemo
pnpm run dev   # 开发调试
pnpm run build # 构建验证

# monorepo 中移植后验证
cd /Users/bytedance/gitlab/flow-web-monorepo
# 按项目实际命令执行
```
