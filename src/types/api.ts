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
  guardianships?: Guardianship[];
  user_id?: string;
}>;

export type AuthUser = Entity<{
  email: string;
  email_verified: boolean;
  locked: boolean;
  active_family_id: string | null;
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
  | 'canManageMemberships';

export type Family = Entity<{
  name: string;
  invitation_ttl_hours: number | null;
  owner: Person;
  resolved_invitation_ttl_hours: number;
  memberships: Membership[];
}>;

export type Membership = Entity<{
  family_id: string;
  role: Role;
  status: 'active' | 'left' | 'removed';
  joined_at: string | null;
  left_at: string | null;
  removed_at: string | null;
  person: Person;
}>;

export interface FamilyWithMembership {
  id: string;
  name: string;
  invitation_ttl_hours: number | null;
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
