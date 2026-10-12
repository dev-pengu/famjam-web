export type SearchProps = {
  open?: boolean;
  setOpen?: (value: React.SetStateAction<boolean | undefined>) => void;
  defaultOpen?: boolean;
  onSearch: (query: string) => void;
  loading?: boolean;
  onCancel?: () => void;
};
