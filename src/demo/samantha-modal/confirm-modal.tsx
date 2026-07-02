import { useState } from 'react';

// TODO(PORTING): 移植时替换为 classnames
// import cls from 'classnames';
import clsx from 'clsx';

import { useLoading } from './use-loading';
import { ConfirmProps } from './type';
import { picoConfirmModalOverride } from './pico-confirm-modal';
import { SamanthaModal } from './modal';

export const ConfirmModal = (props: ConfirmProps) => {
  const [visible, setVisible] = useState(true);
  const { direction, title, content, icon, onCancel, onOk, className, ...rest } =
    props;
  const { loading: confirmLoading, handler: handleOk } = useLoading({
    onTrigger: onOk,
    onFinish: () => setVisible(false),
  });
  const { loading: cancelLoading, handler: handleCancel } = useLoading({
    onTrigger: onCancel,
    onFinish: () => setVisible(false),
  });

  const confirmCls = 'semi-confirm';
  const wrapperCls = clsx(className, confirmCls, {
    [`${confirmCls}-rtl`]: direction === 'rtl',
  });
  const iconNode = icon;
  const titleTextCls = `${confirmCls}-title-text`;
  const titleNode =
    title === null ? null : <span className={titleTextCls}>{title}</span>;
  const contentCls = clsx(`${confirmCls}-content`, {
    [`${confirmCls}-content-withIcon`]: props.icon,
  });
  return (
    <SamanthaModal
      confirmLoading={confirmLoading}
      cancelLoading={cancelLoading}
      className={wrapperCls}
      title={titleNode}
      onOk={handleOk}
      onCancel={handleCancel}
      icon={iconNode}
      visible={visible}
      bodyStyle={{
        paddingTop: '8px',
        paddingBottom: picoConfirmModalOverride.bodyStyle.paddingBottom,
      }}
      {...rest}
    >
      {/* TODO(PORTING): 移植时恢复 x-semi-prop 属性 */}
      <div className={contentCls} /* x-semi-prop="content" */>
        {content}
      </div>
    </SamanthaModal>
  );
};
