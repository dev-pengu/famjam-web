import { cx } from '@/utils/cx';
import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  ColorSpinner,
  ColorSpinnerSize,
  List,
  ListItem,
  ListItemText,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';

import styles from './invitation-list.module.css';
import { useDeleteInvitation } from '../../api/delete-invitation';
import { useGetInvitations } from '../../api/get-invitations';
import { CopyButton } from '@/components/ui';
import { Can } from '@/components/can';

export const InvitationList = ({
  className,
  familyId,
}: {
  className?: string;
  familyId: string;
}) => {
  const { addToast } = useSnackbar();

  const deleteInvitationMutation = useDeleteInvitation({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Invitation revoked successfully' });
      },
    },
  });

  const invitationsQuery = useGetInvitations({
    familyId,
  });

  if (invitationsQuery.isLoading) {
    return (
      <div className={styles.spinnerWrapper}>
        <ColorSpinner size={ColorSpinnerSize.XLarge} />
      </div>
    );
  }

  const invitations = invitationsQuery.data ?? [];

  if (!invitations)
    return (
      <div className={styles.noResultsWrapper}>
        <Typography.Body size={TypographyTextSize.Small} muted>
          No Invitations
        </Typography.Body>
      </div>
    );

  return (
    <div className={cx(styles.wrapper, className)}>
      <List dense className={styles.list}>
        {invitations.map((invitation) => (
          <ListItem
            key={invitation.id}
            className={cx(!invitation.redeemable && styles.unredeemable)}
          >
            <ListItemText primary={invitation.email} />
            <span className={styles.actionWrapper}>
            <CopyButton testID="invite-code" aria-label="Copy invite code">
              <Typography.Body as="code" size={TypographyTextSize.Small}>
                {invitation.code}
              </Typography.Body>
            </CopyButton>
            <Can action="revokeInvitation">
              <Button
                onClick={() =>
                  deleteInvitationMutation.mutate({
                    invitationId: invitation.id,
                    familyId,
                  })
                }
                variant={ButtonVariant.Glass}
                color={ButtonColor.Error}
                size={ButtonSize.Small}
              >
                Revoke
              </Button>
            </Can>
            </span>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
