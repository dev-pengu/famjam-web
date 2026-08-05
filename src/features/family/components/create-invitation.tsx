import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  Input,
  InputState,
  InputVariant,
  LabelVariant,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Select,
  useSnackbar,
} from '@famjam/ui';
import {
  useCreateInvitation,
  invitationInputSchema,
  InvitationRole,
} from '../api/create-invitation';
import { useDisclosure } from '@/hooks/use-diclosure';
import { Form, FormRow } from '@/components/ui';
import { Controller } from 'react-hook-form';

type CreateInvitationProps = {
  familyId: string;
  className?: string;
};

export const CreateInvitation = ({
  familyId,
  className,
}: CreateInvitationProps) => {
  const { addToast } = useSnackbar();
  const { isOpen, open, close } = useDisclosure();
  const createInvitationMutation = useCreateInvitation({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        close();
        addToast({ message: 'Invitation created successfully' });
      },
    },
  });

  return (
    <>
      <Modal open={isOpen} onClose={close}>
        <ModalTitle>Invite a Member</ModalTitle>
        <ModalContent>
          <Form
            id="create-invite"
            onSubmit={(values) => {
              createInvitationMutation.mutate({
                data: values,
              });
            }}
            schema={invitationInputSchema}
            options={{
              defaultValues: {
                email: '',
                role: InvitationRole.adult,
                familyId: familyId,
                ttlOverride: 0,
              },
            }}
          >
            {({ control }) => (
              <>
                <FormRow>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        variant={InputVariant.Email}
                        label="Email"
                        labelVariant={LabelVariant.Float}
                        state={error ? InputState.Error : InputState.Default}
                        helperMessage={error?.message}
                        required
                      />
                    )}
                  />
                </FormRow>
                <FormRow>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Select
                        options={[
                          {
                            label: 'Child',
                            value: InvitationRole.child,
                          },
                          {
                            label: 'Adult',
                            value: InvitationRole.adult,
                          },
                          {
                            label: 'Admin',
                            value: InvitationRole.admin,
                          },
                        ]}
                        {...field}
                        labelVariant={LabelVariant.Float}
                        label="Role"
                        state={error ? InputState.Error : InputState.Default}
                        helperMessage={error?.message}
                        required
                      />
                    )}
                  />
                </FormRow>
                <FormRow>
                  <Controller
                    name="ttlOverride"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        variant={InputVariant.Number}
                        label="Invite Expiration Override (in Hrs)"
                        labelVariant={LabelVariant.Float}
                        state={error ? InputState.Error : InputState.Default}
                        helperMessage={error?.message}
                        max={24 * 30}
                      />
                    )}
                  />
                </FormRow>
              </>
            )}
          </Form>
        </ModalContent>
        <ModalActions align="center">
          <Button
            onClick={close}
            size={ButtonSize.Small}
            variant={ButtonVariant.Glass}
            color={ButtonColor.Error}
          >
            Cancel
          </Button>
          <Button
            loading={createInvitationMutation.isPending}
            disabled={createInvitationMutation.isPending}
            form="create-invite"
            type="submit"
            size={ButtonSize.Small}
            variant={ButtonVariant.Glass}
          >
            Submit
          </Button>
        </ModalActions>
      </Modal>
      <Button
        onClick={open}
        size={ButtonSize.Small}
        variant={ButtonVariant.Glass}
        aria-label="Create invitation"
        className={className}
      >
        <Icon name={IconName.Add} size={18} />
      </Button>
    </>
  );
};
