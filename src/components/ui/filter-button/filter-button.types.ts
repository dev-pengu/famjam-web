export type FilterValue<T = unknown> = {
  display: string;
  value: T;
};

export type RangeFilterValue = {
  label: string;
  min: number;
  minLabel?: string;
  max: number;
  maxLabel?: string;
};

export type FilterGroup<T = unknown> = {
  label: string;
  values: FilterValue<T>[];
};

export type SortValue = {
  label: string;
  value: string;
};

export type Filter = FilterGroup | RangeFilterValue;

export type FilterButtonProps = {
  filters?: Filter[];
  selectedValues?: FilterValue[];
  onDismiss?: () => void;
  onOpen?: () => void;
  onApplyFilters?: () => void;

  sorts?: SortValue[];
  selectedSort?: string;
  defaultSelectedSort?: string;
};
