export async function renderDueBadge(el, dueAt) {
  if (!dueAt) return;
  const res = await fetch(`/api/due?at=${encodeURIComponent(dueAt)}`);
  const { label } = await res.json();
  el.textContent = label;
  el.className = label.startsWith('overdue') ? 'due overdue' : 'due';
}
