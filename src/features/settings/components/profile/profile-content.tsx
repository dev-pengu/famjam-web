import {
  Alert,
  AlertSeverity,
  Avatar,
  Button,
  ButtonColor,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  Divider,
  Icon,
  IconName,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';
import styles from './profile-content.module.css';
import { useResendVerification, useUser } from '@/features/auth/auth';
import { useDisclosure } from '@/hooks/use-diclosure';
import { UpdateProfile } from './update-profile/update-profile';
import { RequiresVerification } from '@/features/auth/components/requires-verification';
import { ChangePassword } from './change-password/change-password';
import { AccountRequest } from './account-request/account-request';
import { AccountRequestKind } from '@/types/api';

export const ProfileContent = () => {
  const user = useUser();
  const {
    isOpen: isProfileFormOpen,
    open: openProfileForm,
    close: closeProfileForm,
  } = useDisclosure();
  const { addToast } = useSnackbar();
  const resendVerifiction = useResendVerification({
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Email sent. Check your inbox.' });
      },
    },
  });

  return (
    <div>
      <section>
        <Typography.Title
          bold
          size={TypographyTextSize.Small}
          className={styles.sectionTitle}
        >
          Profile
        </Typography.Title>
        <div className={styles.sectionContent}>
          <ListItem as="span" className={styles.profileInfo}>
            <ListItemAvatar>
              <Avatar name={user?.data?.person.display_name} />
              {!isProfileFormOpen && (
                <Tooltip content="Edit Profile">
                  <Button
                    onClick={openProfileForm}
                    shape={ButtonShape.Rounded}
                    size={ButtonSize.Small}
                    className={styles.editProfileButton}
                    color={ButtonColor.Secondary}
                    variant={ButtonVariant.Glass}
                  >
                    <Icon name={IconName.Settings} size={16} />
                  </Button>
                </Tooltip>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={user?.data?.person.display_name}
              secondary={`${user?.data?.person.first_name} ${user?.data?.person.last_name}`}
              style={{ paddingLeft: '8px' }}
            />
          </ListItem>
          {isProfileFormOpen && user.data && (
            <UpdateProfile
              onSuccess={() => {
                addToast({
                  message: 'Profile information updated successfully!',
                });
                closeProfileForm();
              }}
              onCancel={closeProfileForm}
              person={user.data.person}
            />
          )}
        </div>
      </section>
      <Divider className={styles.divider} />
      <section>
        <Typography.Title
          size={TypographyTextSize.Small}
          bold
          className={styles.sectionTitle}
        >
          Password
        </Typography.Title>
        <div className={styles.sectionContent}>
          <ChangePassword />
        </div>
      </section>
      <Divider className={styles.divider} />
      <section>
        <Typography.Title
          size={TypographyTextSize.Small}
          bold
          className={styles.sectionTitle}
        >
          Email Verification
        </Typography.Title>
        <div className={styles.sectionContent}>
          {user?.data?.email_verified && (
            <Alert severity={AlertSeverity.Success}>
              Your email has been successfully verified
            </Alert>
          )}
          {!user?.data?.email_verified && (
            <Button
              onClick={() => resendVerifiction.mutate(undefined)}
              color={ButtonColor.Secondary}
              variant={ButtonVariant.Glass}
            >
              Resend Verification Email
            </Button>
          )}
        </div>
      </section>
      <RequiresVerification>
        <Divider className={styles.divider} />
        <section>
          <Typography.Title
            size={TypographyTextSize.Small}
            bold
            className={styles.sectionTitle}
          >
            Data Management
          </Typography.Title>
          <div className={styles.sectionContent}>
            <div className={styles.buttonContainer}>
              <AccountRequest
                kind={AccountRequestKind.export}
                label="Export My Data"
              />
              <AccountRequest
                kind={AccountRequestKind.deletion}
                label="Delete My Data"
                requireConfirmation
              />
            </div>
            <Typography.Body
              size={TypographyTextSize.Medium}
              as="h5"
              bold
              className={styles.sectionSubTitle}
            >
              Account Requests
            </Typography.Body>
            todo: show list of account requests
          </div>
        </section>
      </RequiresVerification>
    </div>
  );
};
