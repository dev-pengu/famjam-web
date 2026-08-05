import * as DrawerPrimitive from '@radix-ui/react-dialog';

import { cx } from '@/utils/cx';
import {
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react';
import styles from './drawer.module.css';
import { Icon, IconName, Typography, TypographyTextSize } from '@famjam/ui';

const Drawer = DrawerPrimitive.Root;

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerClose = DrawerPrimitive.Close;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerOverlay = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cx(styles.overlay, className)}
    {...props}
    ref={ref}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerVariants = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
} as const;

type DrawerVariantType = keyof typeof DrawerVariants;

type DrawerContentProps = ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> & { variant: DrawerVariantType; dark?: boolean };

const DrawerContent = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      variant = DrawerVariants.right,
      dark = false,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cx(styles.drawerContent, styles[variant], className)}
        {...props}
      >
        {children}
        <DrawerPrimitive.Close
          className={cx(styles.drawerClose, dark && styles.drawerCloseDark)}
        >
          <Icon
            name={IconName.Close}
            accessibilityLabel="Close"
            decorative={false}
            size={22}
          />
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  ),
);
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(styles.drawerHeader, className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(styles.drawerFooter, className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, children, ...props }, ref) => {
  const child = isValidElement(children) ? (
    children
  ) : (
    <Typography.Title bold>{children}</Typography.Title>
  );
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cx(styles.title, className)}
      {...props}
    >
      {child}
    </DrawerPrimitive.Title>
  );
});
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, children, ...props }, ref) => {
  const child = isValidElement(children) ? (
    children
  ) : (
    <Typography.Body as="span" size={TypographyTextSize.Small} muted>
      {children}
    </Typography.Body>
  );
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cx(styles.description, className)}
      {...props}
    >
      {child}
    </DrawerPrimitive.Description>
  );
});
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerVariants,
};
