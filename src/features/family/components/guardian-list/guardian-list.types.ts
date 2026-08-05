import type { Guardianship, Person } from '@/types/api';

export type GuardianListProps = {
  guardianships: Guardianship[];
  dependent: Person;
  activeFamilyId: string;
};
