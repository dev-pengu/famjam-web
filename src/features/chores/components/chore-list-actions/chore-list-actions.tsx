import { useState } from 'react';
import styles from './chore-list-actions.module.css';
import { Search } from '@/components/ui';
import { CreateChore } from '../create-chore';

export const ChoreListActions = () => {
  const [searchOpen, setSearchOpen] = useState<boolean | undefined>(false);

  const handleSearch = (query: string) => {};

  return (
    <div className={styles.wrapper}>
      <Search
        open={searchOpen}
        setOpen={setSearchOpen}
        onSearch={handleSearch}
      />
      {!searchOpen && <CreateChore />}
    </div>
  );
};
