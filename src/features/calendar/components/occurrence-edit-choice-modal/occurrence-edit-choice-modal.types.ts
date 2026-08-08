export type OccurrenceEditChoiceModalProps = {
  open: boolean;
  onClose: () => void;
  mode: 'edit' | 'delete';
  onChooseOccurrence: () => void;
  onChooseSeries: () => void;
};
