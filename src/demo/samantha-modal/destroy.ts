export let destroyFns: (() => void)[] = [];

export const clearDestoyFns = () => {
  destroyFns = [];
};
