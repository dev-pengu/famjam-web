import { useCreateAccountRequest } from '@/features/auth/api/create-account-request';
import type { AccountRequestProps } from './account-request.types';
import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Modal,
  ModalActions,
  ModalTitle,
  useSnackbar,
} from '@famjam/ui';
import { useDisclosure } from '@/hooks/use-diclosure';

export const AccountRequest = ({
  kind,
  label,
  requireConfirmation = false,
}: AccountRequestProps) => {
  const { addToast } = useSnackbar();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useDisclosure();
  const createAccountRequest = useCreateAccountRequest({
    mutationConfig: {
      onSuccess: () => {
        addToast({
          message: "You're request has been received and is being processed",
        });
      },
    },
  });

  return (
    <>
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalTitle>Confirm - {label}?</ModalTitle>
        <ModalActions align="center">
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            color={ButtonColor.Error}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            onClick={() => createAccountRequest.mutate({ data: { kind } })}
          >
            Confirm
          </Button>
        </ModalActions>
      </Modal>
      <Button
        variant={ButtonVariant.Glass}
        size={ButtonSize.Small}
        onClick={
          requireConfirmation
            ? openModal
            : () => createAccountRequest.mutate({ data: { kind } })
        }
      >
        {label}
      </Button>
    </>
  );
};
