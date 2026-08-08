import { ChipColor, Color, IconName } from '@famjam/ui';
import { EventCategory } from '../api/create-event';
import type { EventCategory as EventCategoryType } from '@/types/api';

export const CATEGORY_LABEL: Record<EventCategoryType, string> = {
  school: 'School',
  practice_sports: 'Practice / Sports',
  medical: 'Medical',
  travel: 'Travel',
};

export const CATEGORY_COLOR: Record<EventCategoryType, ChipColor> = {
  school: ChipColor.Primary,
  practice_sports: ChipColor.Success,
  medical: ChipColor.Error,
  travel: ChipColor.Info,
};

export const CATEGORY_ICON: Record<EventCategoryType, IconName> = {
  school: IconName.School,
  practice_sports: IconName.Sports,
  medical: IconName.Medical,
  travel: IconName.Travel,
};

export const CATEGORY_ICON_COLOR: Record<EventCategoryType, Color> = {
  school: Color.IconAccentDark,
  practice_sports: Color.IconSuccess,
  medical: Color.IconError,
  travel: Color.IconInfo,
};

export const CATEGORY_OPTIONS = [
  { label: CATEGORY_LABEL.school, value: EventCategory.school },
  {
    label: CATEGORY_LABEL.practice_sports,
    value: EventCategory.practice_sports,
  },
  { label: CATEGORY_LABEL.medical, value: EventCategory.medical },
  { label: CATEGORY_LABEL.travel, value: EventCategory.travel },
];
