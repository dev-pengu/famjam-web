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
  submitButton,
  position = 'bottom',
}: FormDrawerProps) => {
  const { close, open, isOpen } = useDisclosure();

  useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        } else {
          open();
        }
      }}
    >
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className={styles.drawerContent} variant={position}>
        <div className={styles.mainContent}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div>{children}</div>
        </div>
        <DrawerFooter>
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
