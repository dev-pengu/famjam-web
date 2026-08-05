import { useFamily } from '../../context/family-context';
import { Select, SelectSize, Typography, TypographyTextSize } from '@famjam/ui';
import styles from './family-selector.module.css';

export const FamilySelector = () => {
  const { families, activeFamily, switchFamily } = useFamily();

  const handleChange = (value: string | undefined) => {
    if (value) {
      switchFamily(value);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Typography.Body as="span" size={TypographyTextSize.Small}>
        Active Family:
      </Typography.Body>
      <Select
        key={activeFamily?.id}
        options={families.map((family) => ({
          label: family.name,
          value: family.id,
        }))}
        defaultValue={activeFamily?.id}
        onChange={(value) => handleChange(value as string)}
        size={SelectSize.Small}
      />
    </div>
  );
};
