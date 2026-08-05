import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useTheme, Typography, TypographyTextSize } from '@famjam/ui';
import { cx } from '@/utils/cx';
import styles from './tabs.module.css';
import type {
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from './tabs.types';
import { forwardRef, isValidElement } from 'react';

const Tabs = ({
  className,
  testID,
  ...props
}: Readonly<TabsProps & { className?: string }>) => {
  useTheme();

  return (
    <TabsPrimitive.Root
      data-testid={testID}
      className={cx(styles.root, className)}
      {...props}
    />
  );
};
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = forwardRef<HTMLDivElement, Readonly<TabsListProps>>(
  ({ className, testID, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      data-testid={testID}
      className={cx(styles.list, className)}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<HTMLButtonElement, Readonly<TabsTriggerProps>>(
  ({ className, testID, children, ...props }, ref) => {
    const child = isValidElement(children) ? (
      children
    ) : (
      <Typography.Title size={TypographyTextSize.Small} as="span" bold>
        {children}
      </Typography.Title>
    );

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        data-testid={testID}
        className={cx(styles.trigger, className)}
        {...props}
      >
        {child}
      </TabsPrimitive.Trigger>
    );
  },
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<HTMLDivElement, Readonly<TabsContentProps>>(
  ({ className, testID, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      data-testid={testID}
      className={cx(styles.content, className)}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
