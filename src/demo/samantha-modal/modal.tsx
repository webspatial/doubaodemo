/* eslint-disable max-lines-per-function */
// TODO(PORTING): 移植时恢复 lodash-es 导入
// import { isUndefined } from 'lodash-es';
import { isUndefined } from 'lodash-es';
// TODO(PORTING): 移植时替换为 classnames
// import cls from 'classnames';
import clsx from 'clsx';

// TODO(PORTING): 移植时替换为内部基础组件
// import {
//   Modal,
//   IconButton,
//   LocaleConsumer,
// } from '@flow-web/l1-arch-base-samantha-ui-base';
import { Modal, Button, LocaleConsumer } from '@douyinfe/semi-ui';

// TODO(PORTING): 移植时替换为内部图标
// import { IconCloseIcon } from '@flow-web/l1-arch-base-samantha-icons';
import IconClose from '@douyinfe/semi-icons/lib/es/icons/IconClose';

import { useLoading } from './use-loading';
import { SamanthaModalProps } from './type';
// TODO(PORTING): 移植时替换为 SamanthaButton
// import { SamanthaButton } from '../samantha-button';
const SamanthaButton = Button;

// TODO(PORTING): 移植时替换为 modal.module.less
// import styles from './modal.module.less';
import './modal.module.css';

const modalRootClass = 'samantha-modal-root';
const modalCancelClass = 'samantha-modal-cancel';

export const SamanthaModal: React.FC<SamanthaModalProps> = (props) => {
  const {
    title,
    desc,
    icon,
    closable = true,
    closeIcon,
    onCancel,
    onOk,
    okText,
    cancelText,
    hasCancel = true,
    footerFill,
    cancelButtonProps,
    okButtonProps,
    confirmLoading,
    cancelLoading,
  } = props;
  const { loading: innerConfirmLoading, handler: handleOk } = useLoading({
    onTrigger: onOk,
  });
  const { loading: innerCancelLoading, handler: handleCancel } = useLoading({
    onTrigger: onCancel,
  });
  const renderCloseIcon = () => {
    if (!closable) {
      return null;
    }
    return (
      // TODO(PORTING): 移植时替换为 IconButton
      // <IconButton
      //   data-testid="modal_close"
      //   aria-label="close"
      //   key="close-btn"
      //   autoFocus={false}
      //   tabIndex={-1}
      //   onClick={handleCancel}
      //   type="tertiary"
      //   icon={
      //     closeIcon || (
      //       <IconCloseIcon
      //         className="text-s-color-text-tertiary"
      //         tabIndex={-1}
      //       />
      //     )
      //   }
      //   theme="borderless"
      //   size="small"
      //   className="hover:!rounded-s-radius-xxs hover:!bg-s-color-bg-trans"
      // />
      <Button
        aria-label="close"
        key="close-btn"
        autoFocus={false}
        tabIndex={-1}
        onClick={handleCancel}
        type="tertiary"
        icon={closeIcon || <IconClose />}
        theme="borderless"
        size="small"
      />
    );
  };
  const renderHeader = () => {
    const closer = renderCloseIcon();
    return (
      <div data-testid="modal_title" className="pico-modal-header">
        <div className="flex">
          {icon ? (
            <div className="pico-icon mr-8 flex items-center">{icon}</div>
          ) : null}
          <div
            className={`
              pico-modal-title grow text-s-color-text-secondary s-font-h3
            `}
          >
            {title}
          </div>
          {closer}
        </div>
        {desc ? (
          <div className="mt-4 text-s-color-text-secondary s-font-xs">
            {desc}
          </div>
        ) : null}
      </div>
    );
  };
  const renderFooter = () => {
    return (
      <LocaleConsumer componentName="Modal">
        {(locale: { confirm: string; cancel: string }) => (
          <div
            className={clsx({
              'footer-fill grid gap-12': footerFill,
              'grid-cols-[1fr_1fr]': footerFill && hasCancel,
            })}
          >
            {hasCancel ? (
              <SamanthaButton
                type="tertiary"
                onClick={handleCancel}
                loading={
                  isUndefined(cancelLoading)
                    ? innerCancelLoading
                    : cancelLoading
                }
                aria-label="cancel"
                {...(cancelButtonProps as Record<string, unknown>)}
                className={clsx(
                  '!ml-0',
                  modalCancelClass,
                  cancelButtonProps?.className as string,
                )}
              >
                {cancelText || locale.cancel}
              </SamanthaButton>
            ) : null}
            <SamanthaButton
              type="primary"
              onClick={handleOk}
              loading={
                isUndefined(confirmLoading)
                  ? innerConfirmLoading
                  : confirmLoading
              }
              aria-label="confirm"
              {...(okButtonProps as Record<string, unknown>)}
            >
              {okText || locale.confirm}
            </SamanthaButton>
          </div>
        )}
      </LocaleConsumer>
    );
  };
  const defaultProps = {
    // TODO(PORTING): 移植时恢复 IconCloseIcon
    // closeIcon: <IconCloseIcon className="text-s-color-text-tertiary" />,
    closeIcon: <IconClose />,
    bodyStyle: {
      color: 'var(--s-color-text-secondary)',
      font: 'var(--s-font-small)',
      padding: title ? '20px 0' : '8px 0 28px 0',
    },
    ...(title ? { header: renderHeader() } : {}),
    footer: renderFooter(),
  };

  const modalProps = {
    ...defaultProps,
    ...props,
    ...(props.bodyStyle
      ? {
          bodyStyle: Object.assign({}, defaultProps.bodyStyle, props.bodyStyle),
        }
      : {}),
  } as React.ComponentProps<typeof Modal>;
  return (
    <Modal
      {...modalProps}
      className={clsx(modalRootClass, modalProps.className as string)}
    />
  );
};
