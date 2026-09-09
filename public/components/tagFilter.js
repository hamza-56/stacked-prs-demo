export function renderTags(root, tags, { selected, onSelect }) {
  root.innerHTML = '<h2>Tags</h2>';
  if (!tags.length) {
    root.insertAdjacentHTML('beforeend', '<p>No tags yet.</p>');
    return;
  }
  for (const { tag, count } of tags) {
    const btn = document.createElement('button');
    btn.className = 'tag';
    btn.textContent = `${tag} (${count})`;
    btn.disabled = tag === selected;
    btn.addEventListener('click', () => onSelect(tag === selected ? '' : tag));
    root.append(btn, ' ');
  }
}
