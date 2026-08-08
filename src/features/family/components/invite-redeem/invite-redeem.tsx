import type { InviteRedeemProps } from './invite-redeem.types';
import styles from './invite-redeem.module.css';
import { cx } from '@/utils/cx';
import { Form } from '@/components/ui';
import {
  useRedeemInvite,
  invitationRedemptionInputSchema,
} from '../../api/redeem-invitation';
import { Controller } from 'react-hook-form';
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  Input,
  InputState,
  InputVariant,
  LabelVariant,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';
import { useFamily } from '../../context/family-context';

export const InviteRedeem = ({ className }: Readonly<InviteRedeemProps>) => {
  const { addToast } = useSnackbar();
  const { refetchFamilies } = useFamily();
  const inviteRedeemMutation = useRedeemInvite({
    mutationConfig: {
      onSuccess: () => {
        refetchFamilies();
        addToast({ message: 'Welcome to the family!' });
      },
    },
  });

  return (
    <div className={cx(styles.wrapper, className)}>
      <Form
        onSubmit={(values) => {
          inviteRedeemMutation.mutate({
            data: values,
          });
        }}
        schema={invitationRedemptionInputSchema}
        options={{
          defaultValues: {
            code: '',
          },
        }}
        className={styles.form}
      >
        {({ control }) => (
          <>
            <Typography.Body size={TypographyTextSize.Small}>
              Join with invite code:
            </Typography.Body>
            <div className={styles.formControls}>
              <Controller
                name="code"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    variant={InputVariant.Text}
                    label="Invitation Code"
                    labelVariant={LabelVariant.Float}
                    state={error ? InputState.Error : InputState.Default}
                    helperMessage={error?.message}
                    required
                  />
                )}
              />
              <Button
                type="submit"
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                loading={inviteRedeemMutation.isPending}
                className={styles.submitButton}
                aria-label="Join"
              >
                <Icon name={IconName.Add} size={18} />
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
