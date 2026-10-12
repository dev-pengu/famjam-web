import type { IconName } from '@famjam/icons';
import type { ButtonColor, ButtonSize, ButtonVariant } from '@famjam/ui';

export type LabeledIconButtonProps = {
  icon?: IconName;
  letter?: string;
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  colorVariant?: ButtonColor;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
