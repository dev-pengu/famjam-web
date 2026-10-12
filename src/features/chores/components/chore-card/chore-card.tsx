import {
  Avatar,
  AvatarSize,
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Color,
  Icon,
  IconName,
  Skeleton,
  SkeletonVariant,
  Typography,
  TypographyTextSize,
} from '@famjam/ui';
import styles from './chore-card.module.css';
import type { ChoreCardProps } from './chore-card.types';
import { APP_COLOR_TOKEN } from '@/utils/color-palette';
import { useMemo } from 'react';
import { formatFriendlyDate, isOverdue } from '@/utils/date-utils';

export const ChoreCard = ({
  description,
  dueDate,
  assignee,
  reward,
  categoryColor,
  onCompleteClick,
  loading = false,
}: ChoreCardProps) => {
  const handleCompleteClick = () => {
    // TODO api integration
    onCompleteClick?.();
  };

  const handleReassignClick = () => {
    // TODO api integration
  };

  const overdue = useMemo(() => {
    if (!dueDate) return false;
    return isOverdue(new Date(dueDate));
  }, [dueDate]);

  const dueDateDisplay = useMemo(() => {
    if (!dueDate) return;
    return formatFriendlyDate(new Date(dueDate));
  }, [dueDate]);

  return (
    <li
      className={styles.cardWrapper}
      style={{ borderLeftColor: APP_COLOR_TOKEN[categoryColor] }}
    >
      <div className={styles.left}>
        <Button
          variant={ButtonVariant.Text}
          className={styles.completeButton}
          onClick={handleCompleteClick}
          disabled={loading}
        >
          <Icon name={IconName.Check} size={18} />
        </Button>
        <div className={styles.contentWrapper}>
          {loading && (
            <>
              <Skeleton
                variant={SkeletonVariant.Rectangular}
                width={120}
                height={20}
              />
              <Skeleton
                variant={SkeletonVariant.Rectangular}
                width={120}
                height={14}
              />
            </>
          )}
          {!loading && (
            <>
              <Typography.Title as="span" size={TypographyTextSize.Small}>
                {description}
              </Typography.Title>
              <Typography.Body
                as="span"
                size={TypographyTextSize.Small}
                muted
                style={overdue ? { color: Color.TextError } : undefined}
              >
                {dueDateDisplay}
              </Typography.Body>
            </>
          )}
        </div>
      </div>
      <div className={styles.right}>
        {loading && (
          <Skeleton variant={SkeletonVariant.Circular} width={40} height={40} />
        )}
        {!loading && (
          <>
            {assignee && (
              <Avatar
                name={assignee.person.display_name}
                size={AvatarSize.Medium}
                color={APP_COLOR_TOKEN[assignee.color]}
              />
            )}
            {!assignee && (
              <Button
                size={ButtonSize.Medium}
                variant={ButtonVariant.Outline}
                color={ButtonColor.Secondary}
                disabled={loading}
              >
                <Icon name={IconName.Add} size={12} />
              </Button>
            )}
          </>
        )}
        <div className={styles.reward}>
          {reward && (
            <>
              {loading && (
                <Skeleton
                  variant={SkeletonVariant.Rectangular}
                  width={16}
                  height={16}
                />
              )}
              {!loading && (
                <Typography.Body
                  as="span"
                  size={TypographyTextSize.Medium}
                  muted
                >
                  {reward}
                </Typography.Body>
              )}
              <Icon name={IconName.Diamond} color={Color.PaletteCyan} />
            </>
          )}
        </div>
      </div>
    </li>
  );
};
