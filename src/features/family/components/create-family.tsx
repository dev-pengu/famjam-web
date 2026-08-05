import { Form, FormDrawer } from '@/components/ui';
import { familyInputSchema, useCreateFamily } from '../api/create-family';
import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  IconName,
  Input,
  InputState,
  InputVariant,
  LabelVariant,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';
import { Controller } from 'react-hook-form';

export const CreateFamily = () => {
  const { addToast } = useSnackbar();
  const createFamilyMutation = useCreateFamily({
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Family created successfully' });
      },
    },
  });

  return (
    <FormDrawer
      isDone={createFamilyMutation.isSuccess}
      position="left"
      triggerButton={
        <Button
          size={ButtonSize.Small}
          startIcon={IconName.Groups}
          variant={ButtonVariant.Glass}
        >
          <Typography.Body size={TypographyTextSize.Small}>
            Create Family
          </Typography.Body>
        </Button>
      }
      title="Create Family"
      submitButton={
        <Button
          form="create-family"
          type="submit"
          size={ButtonSize.Small}
          loading={createFamilyMutation.isPending}
          color={ButtonColor.Secondary}
          variant={ButtonVariant.Glass}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-family"
        onSubmit={(values) => {
          createFamilyMutation.mutate({ data: values });
        }}
        schema={familyInputSchema}
      >
        {({ control }) => (
          <>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant={InputVariant.Text}
                  label="Family Name"
                  labelVariant={LabelVariant.Float}
                  state={error ? InputState.Error : InputState.Default}
                  helperMessage={error?.message}
                  required
                />
              )}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
