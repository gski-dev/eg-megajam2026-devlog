const filter = document.querySelector('[data-filter]');

if (filter) {
  const search = filter.querySelector('input');
  const counter = filter.querySelector('[role="status"]');
  const entries = [...document.querySelectorAll('[data-entry]')];
  const empty = document.querySelector('[data-empty]');
  const searchable = entries.map(entry => ({ entry, text: entry.textContent.toLocaleLowerCase() }));
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const { entry, text } of searchable) {
      entry.hidden = !text.includes(query);
      if (!entry.hidden) visible++;
    }
    empty.hidden = visible > 0;
    counter.textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'}`;
  };
  filter.hidden = false;
  search.addEventListener('input', update);
  update();
}
