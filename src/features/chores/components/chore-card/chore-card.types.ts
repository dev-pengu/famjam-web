import type { AppColor, Membership } from '@/types/api';

export type ChoreCardProps = {
  categoryColor: AppColor;
  description: string;
  dueDate?: string;
  assignee?: Membership;
  reward?: number;
  onCompleteClick?: () => void;
  loading?: boolean;
};
