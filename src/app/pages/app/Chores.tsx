import { v4 as uuid } from 'uuid';
import { Typography } from '@famjam/ui';

import { ContentLayout } from '@/components/layouts';
import { useFamily } from '@/features/family/context/family-context';
import {
  ChoreFilters,
  ChoreList,
  ChoreListActions,
} from '@/features/chores/components';
import type { Chore } from '@/types/api';

const getRandomElement = (arr: any[]) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

const Chores = () => {
  const { activeFamily } = useFamily();

  const toDoChores: Chore[] = [
    {
      id: uuid(),
      title: 'Cook dinner',
      family_id: '39073f4c-120d-4bd0-9463-17ce7907cc94',
      created_by_user_id: '941e7cca-99ba-45de-9d08-8434a35632ef',
      created_at: '2026-07-30 05:53:47.556',
      status: 'active',
      coin_value: 25,
      assignee: getRandomElement(activeFamily?.memberships ?? []),
      starts_on: '2026-09-02 17:30:00.000',
      category: 'household',
      category_color: 'blue',
    },
    {
      id: uuid(),
      title: 'Sort laundry',
      family_id: '39073f4c-120d-4bd0-9463-17ce7907cc94',
      created_by_user_id: '941e7cca-99ba-45de-9d08-8434a35632ef',
      created_at: '2026-07-30 05:53:47.556',
      status: 'active',
      coin_value: 15,
      assignee: getRandomElement(activeFamily?.memberships ?? []),
      starts_on: '2026-09-02 17:30:00.000',
      category: 'household',
      category_color: 'blue',
    },
    {
      id: uuid(),
      title: 'Walk the dog',
      family_id: '39073f4c-120d-4bd0-9463-17ce7907cc94',
      created_by_user_id: '941e7cca-99ba-45de-9d08-8434a35632ef',
      created_at: '2026-07-30 05:53:47.556',
      status: 'active',
      coin_value: 10,
      assignee: getRandomElement(activeFamily?.memberships ?? []),
      starts_on: '2026-09-02 17:30:00.000',
      category: 'petcare',
      category_color: 'amber',
    },
    {
      id: uuid(),
      title: 'Feed the dog',
      family_id: '39073f4c-120d-4bd0-9463-17ce7907cc94',
      created_by_user_id: '941e7cca-99ba-45de-9d08-8434a35632ef',
      created_at: '2026-07-30 05:53:47.556',
      status: 'active',
      coin_value: 10,
      starts_on: '2026-09-02 17:30:00.000',
      category: 'petcare',
      category_color: 'amber',
    },
  ];
  const upcomingChores: Chore[] = [
    {
      id: uuid(),
      title: 'Go for run',
      family_id: '39073f4c-120d-4bd0-9463-17ce7907cc94',
      created_by_user_id: '941e7cca-99ba-45de-9d08-8434a35632ef',
      created_at: '2026-07-30 05:53:47.556',
      status: 'active',
      coin_value: 5,
      assignee: getRandomElement(activeFamily?.memberships ?? []),
      starts_on: '2026-09-03 17:30:00.000',
      category: 'personal_care',
      category_color: 'violet',
    },
    {
      id: uuid(),
      title: 'Tidy bedroom',
      family_id: '39073f4c-120d-4bd0-9463-17ce7907cc94',
      created_by_user_id: '941e7cca-99ba-45de-9d08-8434a35632ef',
      created_at: '2026-07-30 05:53:47.556',
      status: 'active',
      coin_value: 30,
      assignee: getRandomElement(activeFamily?.memberships ?? []),
      starts_on: '2026-09-04 17:30:00.000',
      category: 'household',
      category_color: 'blue',
    },
  ];

  console.log(toDoChores);

  return (
    <ContentLayout title="Chores">
      {!activeFamily && (
        <Typography.Body>
          Join or create a family to start using the calendar.
        </Typography.Body>
      )}
      {activeFamily && (
        <div>
          <ChoreListActions />
          <ChoreFilters familyId={activeFamily.id} />
          <ChoreList
            listTitle="To-Do"
            chores={toDoChores}
            familyId={activeFamily.id}
          />
          <ChoreList
            listTitle="Upcoming"
            chores={upcomingChores}
            familyId={activeFamily.id}
          />
        </div>
      )}
    </ContentLayout>
  );
};

export default Chores;
