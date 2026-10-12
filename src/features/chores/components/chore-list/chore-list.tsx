import { Color, Typography, TypographyTextSize } from '@famjam/ui';
import styles from './chore-list.module.css';
import { ChoreCard } from '../chore-card';
import type { ChoreListProps } from './chore-list.types';
import { useFamily } from '@/features/family/api/get-family';

export const ChoreList = ({ listTitle, chores, familyId }: ChoreListProps) => {
  const { data, isLoading } = useFamily({ familyId });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Typography.Title size={TypographyTextSize.Medium} bold>
          {listTitle}
        </Typography.Title>
        <Typography.Body size={TypographyTextSize.Medium}>
          {chores.length}
        </Typography.Body>
      </div>
      <ul className={styles.listWrapper}>
        {chores.map((chore) => {
          return (
            <ChoreCard
              key={chore.id}
              description={chore.title}
              categoryColor={chore.category_color}
              assignee={chore.assignee}
              reward={chore.coin_value}
              loading={isLoading}
              dueDate={chore.starts_on}
            />
          );
        })}
      </ul>
    </div>
  );
};
