import {
  Button,
  ButtonColor,
  ButtonVariant,
  Icon,
  IconName,
  Typography,
  TypographyTextSize,
} from '@famjam/ui';
import styles from './main-error.module.css';

export const MainErrorFallback = () => {
  return (
    <div className={styles.errorContainer} role="alert">
      <Typography.Title size={TypographyTextSize.Medium} bold>
        Oops, something went wrong :({' '}
      </Typography.Title>
      <Button
        className={styles.button}
        variant={ButtonVariant.Ghost}
        color={ButtonColor.Secondary}
      >
        <Icon name={IconName.Refresh} size={18} decorative />
        <Typography.Body as="span">Refresh</Typography.Body>
      </Button>
    </div>
  );
};
