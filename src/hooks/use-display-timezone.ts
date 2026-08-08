import { useUser } from '@/features/auth/api/get-user';
import { useFamily } from '@/features/family/context/family-context';

// Mirrors the backend's User#display_timezone fallback chain (user's own
// preference -> family default -> UTC), completed client-side since the
// profile endpoint has no family context to resolve against server-side.
export const useDisplayTimezone = (): string => {
  const { data: authUser } = useUser();
  const { activeFamily } = useFamily();

  return authUser?.timezone || activeFamily?.resolved_timezone || 'UTC';
};
