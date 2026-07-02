import {
  SamanthaModalProps,
  SamanthaModalComponent,
  ModalReturnType,
} from './type';
import { SamanthaModal as Modal } from './modal';
import { destroyFns, clearDestoyFns } from './destroy';
import {
  confirm,
  withInfo,
  withSuccess,
  withWarning,
  withError,
  withConfirm,
} from './confirm';

const SamanthaModal = Modal as SamanthaModalComponent;

SamanthaModal.info = function (props: SamanthaModalProps) {
  return confirm<ReturnType<typeof withInfo>>(withInfo(props));
};

SamanthaModal.success = function (props: SamanthaModalProps) {
  return confirm<ReturnType<typeof withSuccess>>(withSuccess(props));
};

SamanthaModal.warning = function (props: SamanthaModalProps) {
  return confirm<ReturnType<typeof withWarning>>(withWarning(props));
};

SamanthaModal.error = function (props: SamanthaModalProps) {
  return confirm<ReturnType<typeof withError>>(withError(props));
};

SamanthaModal.confirm = function (props: SamanthaModalProps) {
  return confirm<ReturnType<typeof withConfirm>>(withConfirm(props));
};

SamanthaModal.destroyAll = function destroyAllFn() {
  for (let i = 0, len = destroyFns.length; i < len; i++) {
    const close = destroyFns[i];
    if (close) {
      close();
    }
  }
  clearDestoyFns();
};

export type { SamanthaModalProps, ModalReturnType };
export { SamanthaModal };
