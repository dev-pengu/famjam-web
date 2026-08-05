import {
  Button,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@famjam/ui';
import type { FamilyListProps } from './family-list.types';

import styles from './family-list.module.css';
import { useFamily } from '../../context/family-context';
import { LeaveFamilyButton } from '../leave-family-button';

export const FamilyList = ({ families }: Readonly<FamilyListProps>) => {
  const { activeFamily, switchFamily } = useFamily();

  return (
    <List className={styles.familyList}>
      {families.map((family) => {
        const isActive = family.id === activeFamily?.id;
        return (
          <ListItem key={family.id} className={styles.listItem}>
            <ListItemIcon>
              {isActive && <Icon name={IconName.Check} />}
            </ListItemIcon>

            <ListItemText primary={family.name}></ListItemText>
            <span className={styles.buttonGroup}>
              {!isActive && (
                <Button
                  onClick={() => switchFamily(family.id)}
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Glass}
                  className={styles.activateButton}
                >
                  Activate
                </Button>
              )}
              <LeaveFamilyButton familyId={family.id} />
            </span>
          </ListItem>
        );
      })}
    </List>
  );
};
