import { useDisclosure } from '@/hooks/use-diclosure';
import type { ChangePasswordProps } from './change-password.types';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Modal,
  ModalContent,
  ModalTitle,
} from '@famjam/ui';
import { ChangePasswordForm } from '../change-password-form/change-password-form';

export const ChangePassword = ({
  onSuccess,
  onCancel,
}: ChangePasswordProps) => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <Modal open={isOpen} onClose={close}>
        <ModalTitle>Change Password</ModalTitle>
        <ModalContent>
          <ChangePasswordForm
            onSuccess={() => {
              onSuccess?.();
              close();
            }}
            onCancel={() => {
              onCancel?.();
              close();
            }}
          />
        </ModalContent>
      </Modal>
      <Button
        onClick={open}
        color={ButtonColor.Secondary}
        variant={ButtonVariant.Glass}
      >
        Change Password
      </Button>
    </>
  );
};
