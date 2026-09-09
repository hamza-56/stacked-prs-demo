export function now() {
  return new Date().toISOString();
}

export function isPast(iso) {
  return new Date(iso).getTime() < Date.now();
}

export function daysBetween(a, b) {
  const ms = Math.abs(new Date(a) - new Date(b));
  return Math.floor(ms / 86400000);
}

export function formatDue(iso) {
  if (!iso) return '';
  const days = daysBetween(now(), iso);
  if (isPast(iso)) return `overdue by ${days}d`;
  return days === 0 ? 'due today' : `due in ${days}d`;
}
