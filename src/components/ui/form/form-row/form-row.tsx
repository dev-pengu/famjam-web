import type { FormRowProps } from './form-row.types';
import styles from './form-row.module.css';
import { cx } from '@/utils/cx';

export const FormRow = ({ children, className, ...props }: FormRowProps) => {
  return (
    <div className={cx(styles.wrapper, className)} {...props}>
      {children}
    </div>
  );
};
