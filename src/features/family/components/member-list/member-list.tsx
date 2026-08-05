import {
  Avatar,
  AvatarSize,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@famjam/ui';
import type { MemberListProps } from './member-list.types';
import styles from './member-list.module.css';

export const MemberList = ({
  memberships,
  actions,
  onRowClick,
}: Readonly<MemberListProps>) => {
  const Comp = onRowClick ? ListItemButton : ListItem;

  return (
    <List className={styles.memberList}>
      {memberships.map((membership) => (
        <Comp
          key={membership.id}
          className={styles.listItem}
          {...(onRowClick && { onClick: () => onRowClick?.(membership) })}
        >
          <ListItemAvatar>
            <Avatar
              size={AvatarSize.Small}
              name={membership.person.display_name}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${membership.person.display_name}${membership.person.managed ? ' - managed' : ''}`}
            secondary={membership.role}
          />
          <span className={styles.actionWrapper}>
            {actions && actions(membership)}
          </span>
        </Comp>
      ))}
    </List>
  );
};
