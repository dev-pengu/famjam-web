import { Button, ButtonSize, ButtonVariant, Modal, ModalActions, ModalContent, ModalContentText, ModalTitle } from '@famjam/ui';
import type { OccurrenceEditChoiceModalProps } from './occurrence-edit-choice-modal.types';

// A recurring event's occurrence can be changed two ways: just this one date
// (creates/updates an override), or the whole series (edits the parent
// event). "This and future occurrences" is intentionally not offered here -
// deferred on the backend too, see famjam-api Event model comments.
export const OccurrenceEditChoiceModal = ({
  open,
  onClose,
  mode,
  onChooseOccurrence,
  onChooseSeries,
}: Readonly<OccurrenceEditChoiceModalProps>) => {
  const verb = mode === 'edit' ? 'Edit' : 'Delete';

  return (
    <Modal open={open} onClose={onClose}>
      <ModalTitle>{verb} recurring event</ModalTitle>
      <ModalContent>
        <ModalContentText>This event repeats. What would you like to {verb.toLowerCase()}?</ModalContentText>
      </ModalContent>
      <ModalActions align="space-between">
        <Button variant={ButtonVariant.Glass} size={ButtonSize.Small} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={ButtonVariant.Glass} size={ButtonSize.Small} onClick={onChooseOccurrence}>
          {verb} this occurrence
        </Button>
        <Button variant={ButtonVariant.Glass} size={ButtonSize.Small} onClick={onChooseSeries}>
          {verb} whole series
        </Button>
      </ModalActions>
    </Modal>
  );
};
