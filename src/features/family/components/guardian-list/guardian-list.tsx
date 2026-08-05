import type { GuardianListProps } from './guardian-list.types';
import styles from './guardian-list.module.css';
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  InputState,
  LabelVariant,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  SelectSize,
  Typography,
  TypographyTextSize,
} from '@famjam/ui';
import {
  guaridanshipInputSchema,
  useCreateGuardianship,
} from '../../api/guardianship/create-guardianship';
import { useDeleteGuardianship } from '../../api/guardianship/delete-guardianship';
import { CanManaged } from '@/components/can-managed';
import { useDisclosure } from '@/hooks/use-diclosure';
import { Form } from '@/components/ui';
import { useFamily } from '../../context/family-context';
import { Controller } from 'react-hook-form';

export const GuardianList = ({
  guardianships,
  dependent,
  activeFamilyId,
}: GuardianListProps) => {
  const { isOpen, toggle, close } = useDisclosure();
  const createGuardianship = useCreateGuardianship({
    familyId: activeFamilyId,
    mutationConfig: {
      onSuccess: () => {
        close();
      },
    },
  });
  const deleteGuardianship = useDeleteGuardianship({
    familyId: activeFamilyId,
  });
  const { families } = useFamily();

  return (
    <div className={styles.guardianList}>
      <div className={styles.guardianTitle}>
        <Typography.Body size={TypographyTextSize.Medium} bold>
          Guardians:
        </Typography.Body>
        <CanManaged targetPerson={dependent}>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            onClick={toggle}
            aria-label={isOpen ? 'Close guardian form' : 'Open guardian form'}
          >
            <Icon name={isOpen ? IconName.Close : IconName.Add} size={16} />
          </Button>
        </CanManaged>
      </div>
      {isOpen && (
        <Form
          className={styles.guardianForm}
          onSubmit={(values) => createGuardianship.mutate({ data: values })}
          schema={guaridanshipInputSchema}
          options={{
            defaultValues: {
              dependentPersonId: dependent.id,
              familyid: activeFamilyId,
              guardianUserId: '',
            },
          }}
        >
          {({ control }) => (
            <>
              <Controller
                name="guardianUserId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    options={
                      families
                        .find((f) => f.id === activeFamilyId)
                        ?.memberships.filter(
                          (m) =>
                            !m.person.managed &&
                            (m.role === 'owner' ||
                              m.role === 'admin' ||
                              m.role === 'adult'),
                        )
                        .map((m) => {
                          return {
                            value: m.person.user_id!,
                            label: m.person.display_name,
                          };
                        }) ?? []
                    }
                    {...field}
                    label="Guardian"
                    labelVariant={LabelVariant.Float}
                    state={error ? InputState.Error : InputState.Default}
                    helperMessage={error?.message}
                    size={SelectSize.Small}
                    className={styles.input}
                  />
                )}
              />
              <Button
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                type="submit"
              >
                Submit
              </Button>
            </>
          )}
        </Form>
      )}
      <List dense>
        {guardianships.map((guardianship) => (
          <ListItem key={guardianship.id} className={styles.listItem}>
            <ListItemIcon>
              <Icon name={IconName.Remove} />
            </ListItemIcon>
            <ListItemText primary={guardianship.guardian.display_name} />
            <CanManaged targetPerson={dependent}>
              <Button
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                onClick={() =>
                  deleteGuardianship.mutate({
                    familyId: guardianship.family_id,
                    guardianshipId: guardianship.id,
                  })
                }
              >
                <Icon name={IconName.Remove} size={16} />
              </Button>
            </CanManaged>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
