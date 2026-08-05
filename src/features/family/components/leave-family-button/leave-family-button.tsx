import {
  Button,
  ButtonSize,
  ButtonVariant,
  ButtonColor,
  useSnackbar,
} from '@famjam/ui';
import { useRemoveMembership } from '../../api/membership/remove-membership';
import type { LeaveFamilybuttonProps } from './leave-family-button.types';
import { Can } from '@/components/can';

export const LeaveFamilyButton = ({
  familyId,
}: Readonly<LeaveFamilybuttonProps>) => {
  const { addToast } = useSnackbar();
  const removeMembershipMutation = useRemoveMembership({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Successfully left family' });
      },
    },
  });

  return (
    <Can action="leaveFamily">
      <Button
        size={ButtonSize.Small}
        variant={ButtonVariant.Glass}
        color={ButtonColor.Error}
        loading={removeMembershipMutation.isPending}
        onClick={() =>
          removeMembershipMutation.mutate({
            familyId: familyId,
            isCurrentUser: true,
          })
        }
      >
        Leave
      </Button>
    </Can>
  );
};
