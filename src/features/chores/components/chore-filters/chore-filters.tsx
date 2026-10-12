import { useMemberships } from '@/features/family/api/membership/get-memberships';
import styles from './chore-filters.module.css';
import type { ChoreFiltersProps } from './chore-filters.types';
import { ButtonSize, ButtonVariant, IconName } from '@famjam/ui';
import {
  FilterButton,
  LabeledIconButton,
  type Filter,
  type FilterGroup,
  type FilterValue,
  type SortValue,
} from '@/components/ui';
import type { Membership } from '@/types/api';
import { APP_COLOR_TOKEN } from '@/utils/color-palette';
import { useState } from 'react';
import { cx } from '@/utils/cx';

export const ChoreFilters = ({ familyId }: ChoreFiltersProps) => {
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);
  const { data: memberships } = useMemberships({ familyId });

  const filters: Filter[] = [
    {
      label: 'Assignee',
      values:
        memberships?.map((member) => {
          return {
            display: member.person.display_name,
            value: member.person.id,
          } as FilterValue;
        }) ?? [],
    },
    {
      label: 'Gems',
      min: 0,
      max: 500,
    },
  ];

  const sorts: SortValue[] = [
    {
      label: 'Date Due',
      value: 'date asc',
    },
    {
      label: 'Newly Added',
      value: 'created desc',
    },
    {
      label: 'Gems High to Low',
      value: 'gems desc',
    },
    {
      label: 'Gems Low to High',
      value: 'gems asc',
    },
  ];

  const handleQuickFilterButtonClick = (membership?: Membership) => {
    if (!membership) {
      setActiveQuickFilters([]);
      return;
    }

    setActiveQuickFilters((prev) =>
      prev.includes(membership.id)
        ? prev.filter((id) => id !== membership.id)
        : [...prev, membership.id],
    );
  };

  return (
    <div className={styles.wrapper}>
      <LabeledIconButton
        icon={IconName.Home}
        label="All"
        variant={ButtonVariant.Text}
        size={ButtonSize.Medium}
        onClick={() => handleQuickFilterButtonClick()}
        className={cx(
          styles.quickFilter,
          activeQuickFilters.length === 0 ? styles.active : undefined,
        )}
      />
      {memberships?.map((membership) => {
        const backgroundColor = APP_COLOR_TOKEN[membership.color];
        const isActive = activeQuickFilters.includes(membership.id);
        return (
          <LabeledIconButton
            key={membership.id}
            letter={membership.person.display_name.charAt(0)}
            label={membership.person.display_name}
            variant={ButtonVariant.Text}
            size={ButtonSize.Medium}
            style={{
              color: backgroundColor,
            }}
            onClick={() => handleQuickFilterButtonClick(membership)}
            className={cx(
              styles.quickFilter,
              isActive ? styles.active : undefined,
            )}
          />
        );
      })}
      <FilterButton
        filters={filters}
        sorts={sorts}
        defaultSelectedSort="date asc"
      />
    </div>
  );
};
