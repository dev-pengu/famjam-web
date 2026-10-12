import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Icon,
  Spinner,
  SpinnerSize,
  Typography,
  TypographyTextSize,
  useTheme,
} from '@famjam/ui';
import type { LabeledIconButtonProps } from './labeled-icon-button.types';
import { cx } from '@/utils/cx';
import styles from './labeled-icon-button.module.css';
import type { ReactNode } from 'react';

const spinnerSizeByButtonSize: Record<ButtonSize, SpinnerSize> = {
  [ButtonSize.Small]: SpinnerSize.Small,
  [ButtonSize.Medium]: SpinnerSize.Medium,
  [ButtonSize.Large]: SpinnerSize.Large,
};

export const LabeledIconButton = ({
  icon,
  letter,
  label,
  size = ButtonSize.Medium,
  variant = ButtonVariant.Text,
  colorVariant = ButtonColor.Default,
  disabled,
  loading = false,
  className,
  ...props
}: LabeledIconButtonProps) => {
  const isUnavailable = disabled || loading;
  useTheme();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isUnavailable) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    props.onClick?.(event);
  };

  let iconContent: ReactNode;

  if (icon) {
    iconContent = <Icon name={icon} size={20} />;
  } else {
    iconContent = (
      <Typography.Body
        as="span"
        size={TypographyTextSize.Medium}
        style={{ textTransform: 'uppercase' }}
      >
        {letter?.charAt(0) ?? '?'}
      </Typography.Body>
    );
  }

  return (
    <button
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        styles[colorVariant],
        className,
      )}
      data-disabled={isUnavailable ? '' : undefined}
      data-loading={loading ? '' : undefined}
      onClick={handleClick}
      {...props}
    >
      <span
        className={loading ? styles.contentHidden : styles.content}
        aria-hidden={loading}
      >
        {iconContent}
        <Typography.Body size={TypographyTextSize.Small}>
          {label}
        </Typography.Body>
      </span>
      {loading && (
        <span className={styles.spinnerOverlay}>
          <Spinner size={spinnerSizeByButtonSize[size]} />
        </span>
      )}
    </button>
  );
};
