import type { DateTime } from 'luxon';
import type { EventOccurrence } from '@/types/api';

export const HOUR_HEIGHT_PX = 48;
const MIN_BLOCK_MINUTES = 15; // keeps very short events tappable

export type TimedOccurrence = {
  occurrence: EventOccurrence;
  start: DateTime;
  end: DateTime;
};

export type PackedOccurrence = {
  occurrence: EventOccurrence;
  topPx: number;
  heightPx: number;
  leftPercent: number;
  widthPercent: number;
};

// Lays out a single day's timed (non-all-day) occurrences into a grid:
// vertical position from time-of-day, horizontal splitting for anything
// that overlaps. Two passes: group into overlap-connected clusters first
// (so a cluster's column count is based on its true max concurrency), then
// greedily assign each item in a cluster to the first lane whose previous
// occupant has already ended.
export const packDayOccurrences = (items: TimedOccurrence[]): PackedOccurrence[] => {
  const sorted = [...items].sort((a, b) => a.start.toMillis() - b.start.toMillis());

  const clusters: TimedOccurrence[][] = [];
  let current: TimedOccurrence[] = [];
  let clusterEnd: DateTime | null = null;

  sorted.forEach((item) => {
    if (current.length > 0 && clusterEnd && item.start >= clusterEnd) {
      clusters.push(current);
      current = [];
      clusterEnd = null;
    }
    current.push(item);
    clusterEnd = clusterEnd && clusterEnd > item.end ? clusterEnd : item.end;
  });
  if (current.length > 0) clusters.push(current);

  const result: PackedOccurrence[] = [];

  clusters.forEach((cluster) => {
    const laneEnds: DateTime[] = [];
    const lanes: number[] = [];

    cluster.forEach((item) => {
      let lane = laneEnds.findIndex((end) => end <= item.start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(item.end);
      } else {
        laneEnds[lane] = item.end;
      }
      lanes.push(lane);
    });

    const columnCount = laneEnds.length;

    cluster.forEach((item, index) => {
      const lane = lanes[index];
      const startMinutes = item.start.hour * 60 + item.start.minute;
      const durationMinutes = Math.max(item.end.diff(item.start, 'minutes').minutes, MIN_BLOCK_MINUTES);

      result.push({
        occurrence: item.occurrence,
        topPx: (startMinutes / 60) * HOUR_HEIGHT_PX,
        heightPx: (durationMinutes / 60) * HOUR_HEIGHT_PX,
        widthPercent: 100 / columnCount,
        leftPercent: (100 / columnCount) * lane,
      });
    });
  });

  return result;
};
