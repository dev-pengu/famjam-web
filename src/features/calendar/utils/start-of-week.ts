import type { DateTime } from 'luxon';

// ISO weekday is 1 (Mon) .. 7 (Sun); this app's week starts on Sunday, so
// shift back by (weekday % 7) days to land on the most recent Sunday.
export const startOfWeekSunday = (dt: DateTime): DateTime => dt.startOf('day').minus({ days: dt.weekday % 7 });
