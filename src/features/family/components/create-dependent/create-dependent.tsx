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
  useSnackbar,
} from '@famjam/ui';
import {
  dependentInputSchema,
  useCreateDependent,
} from '../../api/dependent/create-dependent';
import type { CreateDependentProps } from './create-dependent.types';
import { Form, FormDrawer, FormRow } from '@/components/ui';
import { Controller } from 'react-hook-form';
import { Can } from '@/components/can';

export const CreateDependent = ({ familyId }: CreateDependentProps) => {
  const { addToast } = useSnackbar();
  const createDependentMutation = useCreateDependent({
    familyId,
    mutationConfig: {
      onSuccess: (data) => {
        addToast({
          message: `${data.person.display_name} has been added to the family`,
        });
      },
    },
  });

  return (
    <Can action="createDependent">
    <FormDrawer
      isDone={createDependentMutation.isSuccess}
      position="left"
      triggerButton={
        <Button
          size={ButtonSize.Medium}
          variant={ButtonVariant.Glass}
          aria-label="Add New Dependent Account"
        >
          <Icon name={IconName.AccountChild} size={22} />
        </Button>
      }
      title="New Dependent"
      submitButton={
        <Button
          form="create-dependent"
          type="submit"
          size={ButtonSize.Small}
          loading={createDependentMutation.isPending}
          color={ButtonColor.Secondary}
          variant={ButtonVariant.Glass}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-dependent"
        onSubmit={(values) => {
          createDependentMutation.mutate({ data: values });
        }}
        schema={dependentInputSchema}
        options={{
          defaultValues: {
            firstName: '',
            lastName: '',
            nickname: undefined,
            familyId,
          },
        }}
      >
        {({ control }) => (
          <>
            <FormRow>
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    variant={InputVariant.Text}
                    label="First Name"
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
                name="lastName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    variant={InputVariant.Text}
                    label="Last Name"
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
                name="nickname"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    variant={InputVariant.Text}
                    label="Nickname"
                    labelVariant={LabelVariant.Float}
                    state={error ? InputState.Error : InputState.Default}
                    helperMessage={error?.message}
                  />
                )}
              />
            </FormRow>
          </>
        )}
      </Form>
    </FormDrawer>
    </Can>
  );
};
