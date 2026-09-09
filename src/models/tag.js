export function normalizeTags(tags = []) {
  return [...new Set(tags.map((t) => String(t).trim().toLowerCase()))]
    .filter(Boolean)
    .sort();
}

export function tagCounts(tasks) {
  const counts = new Map();
  for (const task of tasks) {
    for (const tag of task.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
