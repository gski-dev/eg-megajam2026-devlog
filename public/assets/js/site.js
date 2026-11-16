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

for (const filter of document.querySelectorAll('[data-gallery-filter]')) {
  const scope = filter.closest('.gallery-section') ?? filter.parentElement;
  const entries = [...scope.querySelectorAll('[data-gallery-item]')];
  const search = filter.querySelector('[data-gallery-search]');
  const counter = filter.querySelector('[data-gallery-count]');
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const entry of entries) {
      const text = entry.textContent.toLocaleLowerCase();
      entry.hidden = !query.split(/\s+/).filter(Boolean).every(term => text.includes(term));
      if (!entry.hidden) count++;
    }
    counter.textContent = count ? `${count} of ${entries.length} designs` : 'No matching designs. Try another search.';
  };
  filter.hidden = false;
  search.addEventListener('input', update);
  update();
}

async function initializePlayer(element) {
  if (element.dataset.initialized) return;
  element.dataset.initialized = 'true';
  const find = selector => element.querySelector(selector);
  const canvas = find('canvas');
  const context = canvas.getContext('2d');
  const sheetSelect = find('[data-sheet]');
  const timelineSelect = find('[data-timeline]');
  const play = find('[data-play]');
  const scrub = find('[data-scrub]');
  const pose = find('[data-pose]');
  const status = find('[data-player-status]');
  let picture, selected, frames = [], time = 0, index = 0, playing = false, last = 0, request = 0, raf = 0;
  const duration = () => frames.length ? frames.at(-1).time_seconds - frames[0].time_seconds : 0;
  const pause = () => {playing = false; play.textContent = 'Play'; cancelAnimationFrame(raf); last = 0;};
  const draw = () => {
    if (!picture || !frames.length) return;
    const absolute = Math.min(time, duration()) + frames[0].time_seconds;
    index = 0;
    frames.forEach((frame, i) => {if (frame.time_seconds <= absolute + 1e-8) index = i;});
    const frame = frames[index];
    const [columns, rows] = selected.grid;
    const width = picture.naturalWidth / columns, height = picture.naturalHeight / rows;
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.background = find('[data-background]').value;
    context.drawImage(picture, frame.cell % columns * width, Math.floor(frame.cell / columns) * height, width, height, 0, 0, canvas.width, canvas.height);
    pose.textContent = `Pose ${frame.cell + 1} · ${frame.phase} · source frame ${frame.source_frame}`;
    scrub.value = duration() ? Math.min(time, duration()) / duration() * 1000 : 0;
    find('[data-clock]').textContent = `${Math.min(time, duration()).toFixed(3)} / ${duration().toFixed(3)} s`;
    element.dataset.frame = String(frame.cell);
  };
  const chooseTimeline = () => {
    pause();
    frames = selected.keyframes.filter(frame => frame.timeline === timelineSelect.value).sort((a,b)=>a.time_seconds-b.time_seconds);
    time = 0;
    draw();
  };
  const source = element.dataset.source;
  const base = source.slice(0, source.indexOf('/assets/flipbooks/'));
  const chooseSheet = async sequence => {
    pause();
    const token = ++request;
    selected = sequence.sheets[Number(sheetSelect.value)];
    timelineSelect.replaceChildren(...[...new Set(selected.keyframes.map(frame => frame.timeline))].map(value=>new Option(value,value)));
    picture = null;
    status.textContent = 'Loading the pose sheet…';
    const next = new Image();
    next.src = `${base}${selected.image}`;
    try {
      await next.decode();
      if (request !== token) return;
      picture = next;
      canvas.hidden = false;
      find('.player-fallback').hidden = true;
      for (const controls of element.querySelectorAll('[data-player-controls]')) controls.hidden = false;
      chooseTimeline();
      element.dataset.ready = 'true';
      status.textContent = 'Timed playback of the imagegen poses. The 3D skeletal animation is authored from this reference.';
    } catch {
      if (request !== token) return;
      canvas.hidden = true;
      find('.player-fallback').hidden = false;
      for (const controls of element.querySelectorAll('[data-player-controls]')) controls.hidden = true;
      status.textContent = 'The preview could not load. You can still inspect the full sheets using the image links.';
    }
  };
  const tick = now => {
    if (!playing) return;
    const delta = last ? Math.min((now - last) / 1000, .1) : 0;
    last = now;
    time += delta * Number(find('[data-speed]').value);
    const rest = Math.min(5, Math.max(0, Number(find('[data-rest]').value) || 0));
    if (time > duration() + rest) time = 0;
    draw();
    raf = requestAnimationFrame(tick);
  };
  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error('Unable to load timing');
    const sequence = await response.json();
    sheetSelect.replaceChildren(...sequence.sheets.map((sheet,i)=>new Option(sheet.name,String(i))));
    sheetSelect.addEventListener('change',()=>chooseSheet(sequence));
    timelineSelect.addEventListener('change',chooseTimeline);
    find('[data-background]').addEventListener('change',draw);
    play.addEventListener('click',()=>{
      if (playing) {pause(); return;}
      if (!picture || !frames.length) return;
      playing = true; play.textContent = 'Pause'; last = 0; raf = requestAnimationFrame(tick);
    });
    const step = offset => {
      if (!frames.length) return;
      pause(); time = frames[Math.min(frames.length-1,Math.max(0,index+offset))].time_seconds - frames[0].time_seconds; draw();
    };
    find('[data-previous]').addEventListener('click',()=>step(-1));
    find('[data-next]').addEventListener('click',()=>step(1));
    scrub.addEventListener('input',()=>{pause();time = Number(scrub.value)/1000*duration();draw();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden) pause();});
    if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{if(!entries[0].isIntersecting) pause();}).observe(element);
    await chooseSheet(sequence);
  } catch {
    status.textContent = 'The interactive preview is unavailable. Open the full sheets to inspect the poses.';
  }
}
const players = document.querySelectorAll('[data-player]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries=>{
    for (const entry of entries) if(entry.isIntersecting) {initializePlayer(entry.target);observer.unobserve(entry.target);}
  },{rootMargin:'250px'});
  players.forEach(element=>observer.observe(element));
} else players.forEach(initializePlayer);
