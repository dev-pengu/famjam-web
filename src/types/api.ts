export type BaseEntity = {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type PaginationMeta = {
  page: number;
  total: number;
  totalPages: number;
};

export type Person = Entity<{
  first_name: string;
  last_name: string;
  nickname: string | null;
  display_name: string;
  managed: boolean;
  guardians?: Person[];
  guardianships?: Guardianship[];
  user_id?: string;
}>;

export type AuthUser = Entity<{
  email: string;
  email_verified: boolean;
  locked: boolean;
  active_family_id: string | null;
  timezone: string | null;
  resolved_timezone: string;
  last_login_at: string | null;
  person: Person;
}>;

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export type Role = 'owner' | 'admin' | 'adult' | 'child';

export type MembershipAction =
  | 'view'
  | 'createInvitation'
  | 'revokeInvitation'
  | 'viewInvitations'
  | 'removeMember'
  | 'reactivateMember'
  | 'viewFormerMembers'
  | 'grantAdmin'
  | 'revokeAdmin'
  | 'transferOwnership'
  | 'ageUp'
  | 'createDependent'
  | 'editFamilySettings'
  | 'leaveFamily'
  | 'canManageMemberships'
  | 'setColor';

export type Family = Entity<{
  name: string;
  invitation_ttl_hours: number | null;
  default_timezone: string | null;
  resolved_timezone: string;
  owner: Person;
  resolved_invitation_ttl_hours: number;
  memberships: Membership[];
}>;

export type AppColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'pink';

export type Membership = Entity<{
  family_id: string;
  role: Role;
  status: 'active' | 'left' | 'removed';
  color: AppColor;
  joined_at: string | null;
  left_at: string | null;
  removed_at: string | null;
  person: Person;
}>;

export interface FamilyWithMembership {
  id: string;
  name: string;
  invitation_ttl_hours: number | null;
  default_timezone: string | null;
  resolved_timezone: string;
  created_at: string;
  membership: Membership;
  memberships: Membership[];
}

export type Invitation = Entity<{
  code: string;
  role: Role;
  email: string;
  expires_at: string;
  redeemable: boolean;
}>;

export type Guardianship = Entity<{
  family_id: string;
  guardian: Person;
  dependent: Person;
}>;

export const AccountRequestKind = {
  export: 'export',
  deletion: 'deletion',
} as const;

export type AccountRequestKindType = keyof typeof AccountRequestKind;

export type AccountRequest = Entity<{
  kind: AccountRequestKindType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_at?: string;
  completed_at?: string;
  download_url?: string;
}>;

export type Timezone = {
  label: string;
  value: string;
};

export type EventCategory = 'school' | 'practice_sports' | 'medical' | 'travel';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type NotificationType =
  | 'event_reminder'
  | 'event_invited'
  | 'event_updated'
  | 'event_cancelled'
  | 'agenda_email';

export type AgendaScope = 'mine' | 'whole_family';

export type CalendarEvent = Entity<{
  family_id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: EventCategory | null;
  timezone: string;
  all_day: boolean;
  starts_at: string;
  ends_at: string;
  recurrence_frequency: RecurrenceFrequency | null;
  recurrence_interval: number | null;
  recurrence_byday: string[];
  recurrence_until: string | null;
  created_by: Person;
  participants: Person[];
}>;

export type EventOccurrence = {
  event_id: string;
  occurrence_start_at: string;
  starts_at: string;
  ends_at: string;
  title: string;
  description: string | null;
  location: string | null;
  category: EventCategory | null;
  cancelled: boolean;
  modified: boolean;
  series: boolean;
  event: CalendarEvent;
};

export type EventOccurrenceException = Entity<{
  event_id: string;
  occurrence_start_at: string;
  status: 'modified' | 'cancelled';
  starts_at: string | null;
  ends_at: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
  category: EventCategory | null;
}>;

export type EventParticipant = Entity<{
  event_id: string;
  person: Person;
}>;

export type EventReminder = Entity<{
  event_id: string;
  user_id: string | null;
  minutes_before: number;
}>;

export type AgendaSubscription = Entity<{
  family_id: string;
  scope: AgendaScope;
  interval_days: number;
  send_hour_local: number;
  anchor_date: string;
  enabled: boolean;
  last_sent_at: string | null;
}>;

export type NotificationPreference = {
  notification_type: NotificationType;
  enabled: boolean;
};

export type IcalFeedToken = Entity<{
  webcal_url: string;
}>;

export type Chore = Entity<{
  family_id: string;
  assignee?: Membership;
  created_by_user_id: string;
  title: string;
  category: string;
  category_color: AppColor;
  description?: string;
  coin_value?: number;
  status: 'active' | 'archived' | 'outstanding';
  starts_on?: string;
  recurrence_frequency?: number;
  recurrence_interval?: number;
  recurrence_byday?: string;
  recurrence_until?: string;
}>;

export type ChoreCompletion = Entity<{
  chore_id: string;
  due_on: string;
  completed_by_membership_id: string;
  completed_by: Membership;
  completed_at: string;
  coin_value: number;
  status: 'pending_approval' | 'approved' | 'rejected';
  reviewed_by_user_id: 'string';
  reviewed_at: string;
  rejection_reason: string;
  coin_transaction_id: string;
}>;

export type ChoreOccurrence = {
  due_on: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'outstanding';
  series: string;
  chore: Chore;
  completion: ChoreCompletion;
};
