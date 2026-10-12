import { Button, ButtonVariant, Icon, IconName } from '@famjam/ui';

export const CreateChore = () => {
  return (
    <>
      <Button variant={ButtonVariant.Text}>
        <Icon name={IconName.Add} size={20} />
      </Button>
    </>
  );
};
