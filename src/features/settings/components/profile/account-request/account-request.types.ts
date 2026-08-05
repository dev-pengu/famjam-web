import type { AccountRequestKindType } from '@/types/api';

export type AccountRequestProps = {
  kind: AccountRequestKindType;
  label: string;
  requireConfirmation?: boolean;
};
