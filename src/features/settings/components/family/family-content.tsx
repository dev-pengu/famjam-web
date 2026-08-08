import {
  Alert,
  AlertSeverity,
  Button,
  ButtonSize,
  ButtonVariant,
  ColorSpinner,
  ColorSpinnerSize,
  Divider,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';

import styles from './family-content.module.css';
import {
  CreateDependent,
  InviteRedeem,
  UpdateFamily,
} from '@/features/family/components';
import { useFamily } from '@/features/family/context/family-context';
import { CreateFamily } from '@/features/family/components';
import { Can } from '@/components/can';
import { RequiresVerification } from '@/features/auth/components/requires-verification';
import { InvitationList } from '@/features/family/components';
import { CreateInvitation } from '@/features/family/components';
import { MembershipActionModal } from '@/features/family/components';
import { FamilyList } from '@/features/family/components';
import { MemberList } from '@/features/family/components';
import { useFormerMemberships } from '@/features/family/api/membership/get-former-memberships';
import {
  action,
  useUpdateMembership,
} from '@/features/family/api/membership/update-membership';
import { useMemberships } from '@/features/family/api/membership/get-memberships';
import { CanManaged } from '@/components/can-managed';

export const FamilyContent = () => {
  const { families, activeFamily } = useFamily();
  const { addToast } = useSnackbar();
  const formerMembershipsQuery = useFormerMemberships({
    familyId: activeFamily?.id ?? null,
  });
  const membershipsQuery = useMemberships({
    familyId: activeFamily?.id ?? null,
  });
  const updateMembershipMutation = useUpdateMembership({
    familyId: activeFamily?.id ?? '',
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Successfully reactivated member' });
      },
    },
  });

  let activeMembershipFragment;
  if (membershipsQuery.isPending) {
    activeMembershipFragment = (
      <div className={styles.spinnerContainer}>
        <ColorSpinner size={ColorSpinnerSize.Large} />
      </div>
    );
  } else {
    activeMembershipFragment = (
      <MemberList
        memberships={membershipsQuery.data ?? []}
        actions={(membership) => {
          if (membership.person.managed) {
            return (
              <CanManaged targetPerson={membership.person}>
                <MembershipActionModal membership={membership} />
              </CanManaged>
            );
          }
          return (
            <Can key={activeFamily?.id} action="canManageMemberships">
              <MembershipActionModal membership={membership} />
            </Can>
          );
        }}
      />
    );
  }

  let formerMembershipFragment;
  if (formerMembershipsQuery.isPending) {
    formerMembershipFragment = (
      <div className={styles.spinnerContainer}>
        <ColorSpinner size={ColorSpinnerSize.Large} />
      </div>
    );
  } else {
    formerMembershipFragment = (
      <MemberList
        memberships={formerMembershipsQuery.data ?? []}
        actions={(membership) => {
          if (!activeFamily) return undefined;
          return (
            <Can action="reactivateMember" targetRole={membership.role}>
              <Button
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                loading={updateMembershipMutation.isPending}
                onClick={() =>
                  updateMembershipMutation.mutate({
                    familyId: activeFamily.id,
                    membershipId: membership.id,
                    action: action.reactivate,
                  })
                }
              >
                Reactivate
              </Button>
            </Can>
          );
        }}
      />
    );
  }

  return (
    <RequiresVerification
      fallback={
        <Alert severity={AlertSeverity.Info} title="Email Verification Needed">
          You must verify your email before performing any actions
        </Alert>
      }
    >
      <Can action="editFamilySettings">
        <section>
          <Typography.Title
            as="h3"
            bold
            size={TypographyTextSize.Small}
            className={styles.sectionTitle}
          >
            Active Family
          </Typography.Title>
          {activeFamily && (
            <UpdateFamily key={activeFamily.id} family={activeFamily} />
          )}
          {!activeFamily && (
            <Typography.Body>
              No family found, create one below.
            </Typography.Body>
          )}
        </section>
        <Divider className={styles.divider} />
      </Can>
      <section>
        <span className={styles.sectionTitle}>
          <Typography.Title as="h3" bold size={TypographyTextSize.Small}>
            Manage Family Members
          </Typography.Title>
          {activeFamily && (
            <CreateDependent
              key={activeFamily?.id}
              familyId={activeFamily?.id}
            />
          )}
        </span>
        <Typography.Title
          as="h5"
          muted
          size={TypographyTextSize.Small}
          className={styles.sectionSubtitle}
        >
          Active
        </Typography.Title>
        {activeMembershipFragment}
        <Can action="viewFormerMembers">
          <Typography.Title
            as="h5"
            muted
            size={TypographyTextSize.Small}
            className={styles.sectionSubtitle}
          >
            Inactive
          </Typography.Title>
          {formerMembershipFragment}
        </Can>
      </section>
      <Divider className={styles.divider} />
      <Can action="viewInvitations">
        <section>
          <span className={styles.sectionTitle}>
            <Typography.Title as="h3" bold size={TypographyTextSize.Small}>
              Manage Invites
            </Typography.Title>
            <Can action="createInvitation">
              {activeFamily && <CreateInvitation familyId={activeFamily.id} />}
            </Can>
          </span>
          {activeFamily && (
            <InvitationList key={activeFamily.id} familyId={activeFamily.id} />
          )}
        </section>
        <Divider className={styles.divider} />
      </Can>
      <section>
        <span className={styles.sectionTitle}>
          <Typography.Title as="h3" bold size={TypographyTextSize.Small}>
            Manage Families
          </Typography.Title>
          <CreateFamily />
        </span>
        <InviteRedeem />
        <FamilyList families={families} />
      </section>
    </RequiresVerification>
  );
};
