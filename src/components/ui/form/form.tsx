import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  type Resolver,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { ZodType, z } from 'zod';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type HTMLAttributes,
} from 'react';
import {
  Alert,
  AlertSeverity,
  Typography,
  TypographyTextSize,
} from '@famjam/ui';

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

const FormDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { formDescriptionId } = useFormField();

  return (
    <Typography.Body
      id={formDescriptionId}
      as="p"
      size={TypographyTextSize.Small}
      muted
      className={className}
    >
      {children}
    </Typography.Body>
  );
};

const FormMessage = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <Alert
      severity={AlertSeverity.Error}
      className={className}
      id={formMessageId}
    >
      {body}
    </Alert>
  );
};

type FormProps<TFormValues extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  schema: Schema;
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
};

const Form = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>,
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const form = useForm({
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as Resolver<any, any, any>,
  });
  return (
    <FormProvider {...form}>
      <form
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
        id={id}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
};

export {
  // eslint-disable-next-line react-refresh/only-export-components
  useFormField,
  Form,
  FormProvider,
  FormItem,
  FormDescription,
  FormMessage,
  FormField,
};
