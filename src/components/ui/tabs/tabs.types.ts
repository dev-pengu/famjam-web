import * as TabsPrimitive from '@radix-ui/react-tabs';

export interface WithTestID {
    testID?: string;
}

export type TabsProps = TabsPrimitive.TabsProps & WithTestID;
export type TabsListProps = TabsPrimitive.TabsListProps & WithTestID;
export type TabsTriggerProps = TabsPrimitive.TabsTriggerProps & WithTestID;
export type TabsContentProps = TabsPrimitive.TabsContentProps & WithTestID;