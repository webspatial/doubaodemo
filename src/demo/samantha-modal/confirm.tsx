import ReactDOM from 'react-dom';

import IconInfoCircle from '@douyinfe/semi-icons/lib/es/icons/IconInfoCircle';
import IconTickCircle from '@douyinfe/semi-icons/lib/es/icons/IconTickCircle';
import IconAlertCircle from '@douyinfe/semi-icons/lib/es/icons/IconAlertCircle';
import IconCrossCircleStroked from '@douyinfe/semi-icons/lib/es/icons/IconCrossCircleStroked';

import { SamanthaModalProps, ConfirmProps } from './type';
import { destroyFns } from './destroy';
import { ConfirmModal } from './confirm-modal';

export function confirm<T>(props: ConfirmProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentConfig = { ...props };

  const destroy = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];

      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  };

  function render(renderProps: ConfirmProps) {
    const { afterClose } = renderProps;
    ReactDOM.render(
      <ConfirmModal
        {...renderProps}
        afterClose={() => {
          afterClose?.();
          destroy();
        }}
        motion={props.motion}
      />,
      div,
    );
  }

  function close() {
    currentConfig = {
      ...currentConfig,
      visible: false,
    };
    render(currentConfig);
  }

  function update(
    newConfig: T extends { type: Exclude<ConfirmProps['type'], 'confirm'> }
      ? SamanthaModalProps
      : ConfirmProps,
  ) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update,
  };
}

export function withInfo(props: SamanthaModalProps): ConfirmProps {
  return {
    type: 'info' as const,
    icon: <IconInfoCircle className="py-2 text-20 text-s-color-system-info" />,
    ...props,
  };
}

export function withConfirm(props: SamanthaModalProps): ConfirmProps {
  return {
    type: 'confirm' as const,
    icon: <IconInfoCircle className="py-2 text-20 text-s-color-system-info" />,
    ...props,
  };
}

export function withSuccess(props: SamanthaModalProps): ConfirmProps {
  return {
    type: 'success' as const,
    icon: <IconTickCircle className="py-2 text-20 text-s-color-system-success" />,
    ...props,
  };
}

export function withWarning(props: SamanthaModalProps): ConfirmProps {
  const { okButtonProps = {}, ...rest } = props;
  return {
    type: 'warning' as const,
    icon: (
      <div className="pico-warning-icon">
        <IconAlertCircle className="py-2 text-20 text-s-color-system-warning" />
      </div>
    ),
    okButtonProps: {
      type: 'danger' as const,
      ...okButtonProps,
    },
    ...rest,
  };
}

export function withError(props: SamanthaModalProps): ConfirmProps {
  const { okButtonProps = {}, ...rest } = props;
  return {
    type: 'error' as const,
    icon: <IconCrossCircleStroked className="py-2 text-20 text-s-color-system-alert" />,
    okButtonProps: {
      type: 'danger' as const,
      ...okButtonProps,
    },
    ...rest,
  };
}
