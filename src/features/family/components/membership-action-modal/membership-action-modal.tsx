import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  ColorSwatchPicker,
  Icon,
  IconName,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';
import type { MembershipActionModalProps } from './membership-action-modal.types';
import { useDisclosure } from '@/hooks/use-diclosure';
import styles from './membership-action-modal.module.css';
import { Can } from '@/components/can';
import {
  action,
  useUpdateMembership,
  type ActionType,
} from '../../api/membership/update-membership';
import { useUpdateMembershipColor } from '../../api/membership/update-membership-color';
import { useRemoveMembership } from '../../api/membership/remove-membership';
import { useDeleteDependent } from '../../api/dependent/delete-dependent';
import { CanManaged } from '@/components/can-managed';
import { ClaimManagedForm } from '../claim-managed-form/claim-managed-form';
import { GuardianList } from '../guardian-list/guardian-list';
import type { AppColor } from '@/types/api';

export const MembershipActionModal = ({
  membership,
}: Readonly<MembershipActionModalProps>) => {
  const { isOpen, open, close } = useDisclosure();
  const { addToast } = useSnackbar();
  const {
    isOpen: claimFormOpen,
    open: openClaimForm,
    close: closeClaimForm,
  } = useDisclosure();
  const updateMembershipMutation = useUpdateMembership({
    familyId: membership.family_id,
    mutationConfig: {
      onSuccess: () => {
        close();
        addToast({ message: 'Member role updated' });
      },
    },
  });
  const removeMemberMutation = useRemoveMembership({
    familyId: membership.family_id,
    mutationConfig: {
      onSuccess: () => {
        close();
        addToast({ message: 'Member removed' });
      },
    },
  });
  const deleteDependentMutation = useDeleteDependent({
    familyId: membership.family_id,
    mutationConfig: {
      onSuccess: () => {
        close();
        addToast({ message: 'Dependent removed' });
      },
    },
  });
  const updateColorMutation = useUpdateMembershipColor({
    familyId: membership.family_id,
    mutationConfig: {
      onSuccess: () => addToast({ message: 'Color updated' }),
    },
  });

  const handleRoleMutation = (action: ActionType) => {
    updateMembershipMutation.mutate({
      familyId: membership.family_id,
      membershipId: membership.id,
      action,
    });
  };

  let modalActions;
  if (membership.person.managed) {
    modalActions = (
      <>
        <Can action="ageUp" targetRole={membership.role}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            loading={updateMembershipMutation.isPending}
            onClick={() => handleRoleMutation(action.ageUp)}
            aria-label="Convert to an adult account"
          >
            Age Up
          </Button>
        </Can>
        <CanManaged targetPerson={membership.person}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            loading={claimFormOpen}
            onClick={() => openClaimForm()}
            aria-label="Migrate to full account"
          >
            Migrate
          </Button>
        </CanManaged>
        <CanManaged targetPerson={membership.person}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            color={ButtonColor.Error}
            loading={deleteDependentMutation.isPending}
            onClick={() =>
              deleteDependentMutation.mutate({
                familyId: membership.family_id,
                dependentId: membership.id,
              })
            }
            aria-label="Remove member"
          >
            Remove
          </Button>
        </CanManaged>
      </>
    );
  } else {
    modalActions = (
      <>
        <Can action="grantAdmin" targetRole={membership.role}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            loading={updateMembershipMutation.isPending}
            onClick={() => handleRoleMutation(action.grant)}
            aria-label="Grant user admin"
          >
            Grant Admin
          </Button>
        </Can>
        <Can action="revokeAdmin" targetRole={membership.role}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            color={ButtonColor.Warning}
            loading={updateMembershipMutation.isPending}
            onClick={() => handleRoleMutation(action.revoke)}
            aria-label="Revoke admin privileges"
          >
            Revoke Admin
          </Button>
        </Can>
        <Can action="transferOwnership" targetRole={membership.role}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            loading={updateMembershipMutation.isPending}
            onClick={() => handleRoleMutation(action.transfer)}
            aria-label="Transfer ownership"
          >
            Make Owner
          </Button>
        </Can>
        <Can action="removeMember" targetRole={membership.role}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            color={ButtonColor.Error}
            loading={removeMemberMutation.isPending}
            onClick={() =>
              removeMemberMutation.mutate({
                familyId: membership.family_id,
                isCurrentUser: false,
                membershipId: membership.id,
              })
            }
            aria-label="Remove member"
          >
            Remove
          </Button>
        </Can>
      </>
    );
  }

  return (
    <>
      <Modal open={isOpen} onClose={close}>
        <ModalTitle>Membership Actions</ModalTitle>
        <ModalContent>
          <Typography.Body>{membership.person.display_name}</Typography.Body>
          <span className={styles.role}>
            <Typography.Body size={TypographyTextSize.Small} bold>
              Current Role:
            </Typography.Body>
            <Typography.Body size={TypographyTextSize.Small}>
              {membership.role}
            </Typography.Body>
          </span>
          {membership.person.guardianships && (
            <GuardianList
              guardianships={membership.person.guardianships}
              dependent={membership.person}
              activeFamilyId={membership.family_id}
            />
          )}
          <Can action="setColor">
            <ColorSwatchPicker
              label="Calendar Color"
              value={membership.color}
              onChange={(value) =>
                updateColorMutation.mutate({
                  familyId: membership.family_id,
                  membershipId: membership.id,
                  color: value as AppColor,
                })
              }
            />
          </Can>
          <span className={styles.buttonContainer}>{modalActions}</span>
          {claimFormOpen && (
            <ClaimManagedForm
              familyId={membership.family_id}
              dependentId={membership.id}
              onSuccess={() => {
                closeClaimForm();
              }}
              onCancel={() => closeClaimForm()}
            />
          )}
        </ModalContent>
        <ModalActions align="center">
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            onClick={close}
            color={ButtonColor.Error}
          >
            Cancel
          </Button>
        </ModalActions>
      </Modal>
      <Button
        variant={ButtonVariant.Glass}
        size={ButtonSize.Small}
        onClick={open}
      >
        <Icon name={IconName.Edit} size={18} />
      </Button>
    </>
  );
};
