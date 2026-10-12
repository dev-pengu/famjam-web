import {
  Button,
  ButtonColor,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  Input,
  InputAdornment,
  InputShape,
  InputSize,
  InputVariant,
  useControlled,
} from '@famjam/ui';
import type { SearchProps } from './search.types';
import { useState } from 'react';
import styles from './search.module.css';

export const Search = ({
  open: controlledOpen,
  setOpen: onChange,
  defaultOpen,
  loading,
  onSearch,
  onCancel,
}: Readonly<SearchProps>) => {
  const [open, setOpen] = useControlled({
    controlledValue: controlledOpen,
    defaultValue: defaultOpen,
    onChange,
  });
  const [query, setQuery] = useState<string>('');

  const handleSubmit = () => {
    if (query.length < 1) return;
    onSearch(query);
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };

  return (
    <>
      {!open && (
        <Button
          size={ButtonSize.Medium}
          variant={ButtonVariant.Text}
          onClick={() => setOpen(true)}
        >
          <Icon name={IconName.Search} size={20} />
        </Button>
      )}
      {open && (
        <div className={styles.searchInputWrapper}>
          <Input
            variant={InputVariant.Text}
            maxLength={255}
            value={query}
            onChange={(value) => setQuery(value.target.value)}
            inputSize={InputSize.Small}
            shape={InputShape.Rounded}
          >
            <InputAdornment position="end">
              <Button onClick={handleCancel} variant={ButtonVariant.Text}>
                <Icon name={IconName.Close} size={18} />
              </Button>
            </InputAdornment>
          </Input>
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Medium}
            shape={ButtonShape.Rounded}
            loading={loading}
            color={ButtonColor.Accent}
            onClick={handleSubmit}
          >
            <Icon name={IconName.Search} size={20} />
          </Button>
        </div>
      )}
    </>
  );
};
