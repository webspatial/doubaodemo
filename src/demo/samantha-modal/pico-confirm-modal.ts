// TODO(PORTING): 移植时替换为 @flow-web/l1-arch-base-utils 的 selectByPico
// import { selectByPico } from '@flow-web/l1-arch-base-utils';

const IS_PICO = false;
const selectByPico = <T,>(picoValue: T, defaultValue: T): T =>
  IS_PICO ? picoValue : defaultValue;

const paddingBottom = selectByPico('32px', '16px');

export const picoConfirmModalOverride = {
  bodyStyle: {
    paddingBottom,
  },
};
