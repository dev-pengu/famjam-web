import {
  Avatar,
  AvatarGroup,
  AvatarSize,
  Breakpoint,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  ChipColor,
  Icon,
  IconName,
  Typography,
  TypographyTextSize,
  useBreakpoints,
} from '@famjam/ui';
import type { AgendaCardProps } from './agenda-card.types';
import styles from './agenda-card.module.css';
import {
  CATEGORY_COLOR,
  CATEGORY_ICON,
  CATEGORY_ICON_COLOR,
  CATEGORY_LABEL,
} from '../../constants/event-category';
import { DateTime } from 'luxon';
import { useDisplayTimezone } from '@/hooks/use-display-timezone';

export const AgendaCard = ({
  occurrence,
  onOccurrenceClick,
  colorByPersonId,
}: AgendaCardProps) => {
  const displayTimezone = useDisplayTimezone();
  const { breakpoint } = useBreakpoints();

  const start = DateTime.fromISO(occurrence.starts_at, {
    zone: displayTimezone,
  });
  const end = DateTime.fromISO(occurrence.ends_at, {
    zone: displayTimezone,
  });

  let content;
  if (breakpoint === Breakpoint.Mobile) {
    content = (
      <>
        <div className={styles.cardTime}>
          <Typography.Body size={TypographyTextSize.Small}>
            {occurrence.event.all_day ? 'All day' : start.toFormat('h:mm a')}
          </Typography.Body>
          {!occurrence.event.all_day && (
            <Typography.Body size={TypographyTextSize.Small} muted>
              {end.toFormat('h:mm a')}
            </Typography.Body>
          )}
        </div>
        <div className={styles.cardBody}>
          <span className={styles.description}>
            <span className={styles.descriptionText}>
              <Typography.Body as="span" bold>
                {occurrence.title}
              </Typography.Body>{' '}
              {occurrence.location && (
                <Typography.Body
                  as="span"
                  size={TypographyTextSize.Small}
                  muted
                >
                  ({occurrence.location})
                </Typography.Body>
              )}
            </span>
            <span className={styles.categoryIcons}>
              {occurrence.category && (
                <Icon
                  name={CATEGORY_ICON[occurrence.category]}
                  size={16}
                  color={CATEGORY_ICON_COLOR[occurrence.category]}
                />
              )}
              {occurrence.series && (
                <Icon name={IconName.EventRepeat} size={16} />
              )}
            </span>
          </span>
          <span className={styles.participants}>
            {occurrence.event.participants.map((person) => (
              <>
                <Icon
                  name={IconName.DotFilled}
                  size={10}
                  color={colorByPersonId.get(person.id)}
                />
                <Typography.Body size={TypographyTextSize.Small}>
                  {person.display_name}
                </Typography.Body>
              </>
            ))}
          </span>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className={styles.cardTime}>
          <Typography.Body size={TypographyTextSize.Small}>
            {occurrence.event.all_day ? 'All day' : start.toFormat('h:mm a')}
          </Typography.Body>
          {!occurrence.event.all_day && (
            <Typography.Body size={TypographyTextSize.Small} muted>
              {end.toFormat('h:mm a')}
            </Typography.Body>
          )}
        </div>
        <div className={styles.cardBody}>
          <Typography.Body bold>{occurrence.title}</Typography.Body>
          {occurrence.location && (
            <Typography.Body size={TypographyTextSize.Small} muted>
              {occurrence.location}
            </Typography.Body>
          )}
          <div className={styles.cardTags}>
            {occurrence.category && (
              <Chip
                label={CATEGORY_LABEL[occurrence.category]}
                color={CATEGORY_COLOR[occurrence.category]}
                dismissable={false}
              />
            )}
            {occurrence.series && (
              <Chip
                label="Repeats"
                color={ChipColor.Default}
                dismissable={false}
              />
            )}
          </div>
        </div>
        <AvatarGroup>
          {occurrence.event.participants.map((person) => (
            <Avatar
              key={person.id}
              size={AvatarSize.Small}
              name={person.display_name}
              color={colorByPersonId.get(person.id)}
            />
          ))}
        </AvatarGroup>
      </>
    );
  }

  return (
    <Card>
      <CardActionArea onClick={() => onOccurrenceClick(occurrence)}>
        <CardContent className={styles.cardContent}>{content}</CardContent>
      </CardActionArea>
    </Card>
  );
};
