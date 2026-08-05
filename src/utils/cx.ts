export const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');
