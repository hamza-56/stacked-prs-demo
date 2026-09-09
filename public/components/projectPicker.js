export function renderProjects(root, projects, { selected, onSelect }) {
  root.innerHTML = '<h2>Projects</h2>';
  const list = document.createElement('ul');
  const entries = [{ id: '', name: 'All projects' }, ...projects];
  for (const project of entries) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = project.name;
    btn.disabled = project.id === selected;
    btn.addEventListener('click', () => onSelect(project.id));
    li.append(btn);
    list.append(li);
  }
  root.append(list);
}
