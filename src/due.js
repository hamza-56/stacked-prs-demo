export function parseDue(input) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('invalid due date');
  return date.toISOString();
}

export function dueLabel(iso, from = Date.now()) {
  if (!iso) return '';
  const days = Math.floor((new Date(iso) - from) / 86400000);
  if (days < 0) return `overdue by ${Math.abs(days)}d`;
  return days === 0 ? 'due today' : `due in ${days}d`;
}
