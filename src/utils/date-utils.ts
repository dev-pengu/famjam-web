export const formatFriendlyDate = (date: Date): string => {
  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const today = startOfDay(new Date());
  const target = startOfDay(date);

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let label: string;
  if (diffDays === 0) {
    label = 'Today';
  } else if (diffDays === -1) {
    label = 'Yesterday';
  } else if (diffDays === 1) {
    label = 'Tomorrow';
  } else if (diffDays < -1) {
    label = `${Math.abs(diffDays)} days ago`;
  } else {
    label = `in ${diffDays} days`;
  }

  return `${time} ${label}`;
};

export const isOverdue = (date: Date) => {
  const currentDate = new Date();
  return currentDate > date;
};
