// TODO(PORTING): 移植时替换为内部 ModalReactProps
// import { ModalReactProps } from '@flow-web/l1-arch-base-samantha-ui-base/modal/index.js';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal/Modal';

// TODO(PORTING): 移植时替换为 SamanthaButton 的 ButtonProps
// import { ButtonProps } from '../samantha-button';
type ButtonProps = Record<string, unknown>;

export type SamanthaModalProps = Omit<
  ModalReactProps,
  'okButtonProps' | 'cancelButtonProps'
> & {
  // size?: 'small' | 'medium' | 'large' | 'x-large' | 'full-width';
  desc?: string;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
};

export interface ConfirmProps extends SamanthaModalProps {
  type: 'success' | 'info' | 'warning' | 'error' | 'confirm';
}

export interface ModalReturnType {
  destroy: () => void;
  update: (props: ConfirmProps) => void;
}

export interface SamanthaModalComponent extends React.FC<SamanthaModalProps> {
  info: (props: SamanthaModalProps) => ModalReturnType;
  success: (props: SamanthaModalProps) => ModalReturnType;
  error: (props: SamanthaModalProps) => ModalReturnType;
  warning: (props: SamanthaModalProps) => ModalReturnType;
  confirm: (props: SamanthaModalProps) => ModalReturnType;
  destroyAll: () => void;
}
