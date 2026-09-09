import { toast } from './toast.js';

function formatDue(iso) {
  if (!iso) return '';
  const days = Math.floor((new Date(iso) - Date.now()) / 86400000);
  if (days < 0) return `overdue by ${Math.abs(days)}d`;
  return days === 0 ? 'due today' : `due in ${days}d`;
}

export function renderTasks(root, tasks, { onStateChange }) {
  root.innerHTML = '';
  if (!tasks.length) {
    root.innerHTML = '<p>Nothing here yet.</p>';
    return;
  }
  for (const task of tasks) {
    const row = document.createElement('div');
    row.className = 'task';
    row.dataset.state = task.state;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = task.state === 'done';
    box.addEventListener('change', async () => {
      await onStateChange(task.id, box.checked ? 'done' : 'todo');
      toast(box.checked ? 'Marked done' : 'Reopened');
    });

    const title = document.createElement('span');
    title.textContent = task.title;

    row.append(box, title);
    for (const tag of task.tags) {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      row.append(span);
    }
    if (task.dueAt) {
      const due = document.createElement('span');
      due.className = 'due';
      due.textContent = formatDue(task.dueAt);
      row.append(due);
    }
    root.append(row);
  }
}
