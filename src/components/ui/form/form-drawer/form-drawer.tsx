import { useDisclosure } from '@/hooks/use-diclosure';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from '../../drawer';
import { Button, ButtonColor, ButtonSize, ButtonVariant } from '@famjam/ui';
import { useEffect } from 'react';
import styles from './form-drawer.module.css';
import type { FormDrawerProps } from './form-drawer.types';

export const FormDrawer = ({
  title,
  children,
  isDone,
  triggerButton,
  open: controlledOpen,
  onOpenChange,
  submitButton,
  position = 'bottom',
}: FormDrawerProps) => {
  const isControlled = controlledOpen !== undefined;
  const { close, open, isOpen: internalIsOpen } = useDisclosure();
  const isOpen = isControlled ? controlledOpen : internalIsOpen;

  const setOpen = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next);
    } else if (next) {
      open();
    } else {
      close();
    }
  };

  useEffect(() => {
    if (isDone) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {triggerButton && <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>}
      <DrawerContent className={styles.drawerContent} variant={position}>
        <div className={styles.mainContent}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div>{children}</div>
        </div>
        <DrawerFooter className={styles.drawerFooter}>
          <DrawerClose asChild>
            <Button
              variant={ButtonVariant.Glass}
              type="submit"
              color={ButtonColor.Error}
              size={ButtonSize.Small}
            >
              Close
            </Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
