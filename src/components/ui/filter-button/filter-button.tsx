import { Fragment } from 'react';
import {
  type FilterValue,
  type FilterButtonProps,
  type Filter,
  type FilterGroup,
  type RangeFilterValue,
} from './filter-button.types';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer';

import styles from './filter-button.module.css';
import { LabeledIconButton } from '../labeled-icon-button';
import { IconName } from '@famjam/icons';
import {
  Breakpoint,
  Button,
  ButtonColor,
  ButtonVariant,
  Checkbox,
  Divider,
  RadioGroup,
  RadioItem,
  Slider,
  SliderLabelDisplay,
  SliderSize,
  Typography,
  TypographyTextSize,
  useBreakpoints,
  useControlled,
} from '@famjam/ui';
import { useDisclosure } from '@/hooks/use-diclosure';

function isFilterGroup(filter: Filter): filter is FilterGroup {
  return 'values' in filter;
}

function isRangeFilterValue(filter: Filter): filter is RangeFilterValue {
  return 'min' in filter && 'max' in filter;
}

export const FilterButton = ({
  filters,
  selectedValues: controlledSelected,
  onOpen,
  onDismiss,
  onApplyFilters,

  sorts,
  selectedSort: controlledSort,
  defaultSelectedSort,
}: FilterButtonProps) => {
  const { close, open, isOpen } = useDisclosure();
  const [selectedValues, setSelectedValues] = useControlled({
    controlledValue: controlledSelected,
    defaultValue: [],
  });
  const [selectedSort, setSelectedSort] = useControlled({
    controlledValue: controlledSort,
    defaultValue: defaultSelectedSort,
  });
  const { breakpoint } = useBreakpoints();

  const handleFilterClick = (value: FilterValue) => {
    setSelectedValues((prev) => {
      if (!prev) {
        return prev;
      }
      if (prev.includes(value)) {
        return prev.filter((f) => f !== value);
      }
      return [...prev, value];
    });
  };

  const setOpen = (next: boolean) => {
    if (next) {
      open();
      onOpen?.();
    } else {
      close();
      onDismiss?.();
    }
  };

  const handleApply = () => {
    onApplyFilters?.();
    close();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <LabeledIconButton
          icon={IconName.PageInfo}
          label="Filter"
          className={
            (selectedValues?.length ?? 0 > 0) ? styles.filtered : undefined
          }
        />
      </DrawerTrigger>
      <DrawerContent
        variant={breakpoint === Breakpoint.Mobile ? 'bottom' : 'left'}
        className={styles.filterSheet}
      >
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        {sorts && (
          <div className={styles.sorts}>
            <Typography.Title size={TypographyTextSize.Small} bold>
              Sort
            </Typography.Title>
            <RadioGroup
              value={selectedSort}
              onValueChange={(v) => setSelectedSort(v)}
              radioLabelPosition="start"
              className={styles.sortList}
            >
              {sorts.map((sort) => (
                <RadioItem label={sort.label} value={sort.value} />
              ))}
            </RadioGroup>
            <Divider />
          </div>
        )}
        {filters && (
          <div className={styles.filters}>
            {filters.map((group, i) => (
              <Fragment key={group.label}>
                <div className={styles.filter}>
                  <Typography.Title size={TypographyTextSize.Small} bold>
                    {group.label}
                  </Typography.Title>
                  {isFilterGroup(group) && (
                    <div className={styles.valuesWrapper}>
                      {group.values.map((v) => {
                        const value = v as FilterValue;
                        return (
                          <Checkbox
                            key={`${group.label}-${value.display}`}
                            label={value.display}
                            checked={
                              selectedValues?.find((f) => f === value) !==
                              undefined
                            }
                            onCheckedChange={() => handleFilterClick(value)}
                          />
                        );
                      })}
                    </div>
                  )}
                  {isRangeFilterValue(group) && (
                    <div className={styles.sliderGroup}>
                      <Slider
                        min={group.min}
                        max={group.max}
                        defaultValue={[group.min, group.max]}
                        range
                        size={SliderSize.Default}
                      />
                    </div>
                  )}
                </div>
                {i <= filters.length && <Divider />}
              </Fragment>
            ))}
          </div>
        )}
        <DrawerFooter className={styles.footer}>
          <Button
            variant={ButtonVariant.Glass}
            onClick={() => setSelectedValues([])}
          >
            Clear
          </Button>
          <Button
            variant={ButtonVariant.Glass}
            color={ButtonColor.Accent}
            onClick={handleApply}
          >
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
