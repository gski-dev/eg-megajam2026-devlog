"""Export the selected devlog image library from a local high-fantasy asset root.
Usage: python scripts/export-process-assets.py /path/to/assets/drafts/high-fantasy
Requires Pillow only when refreshing media; normal website builds use committed exports.
"""
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, re, sys

source = Path(sys.argv[1]).resolve()
repo = Path(__file__).resolve().parents[1]
media = repo / 'public/assets/process'
media.mkdir(parents=True, exist_ok=True)
jobs, provenance = {}, []
def publish(file, lossless=False, full=False):
    file = file.resolve()
    relative = file.relative_to(source).as_posix()
    target = Path(relative).with_suffix('.webp')
    destination = media / target
    if destination not in jobs:
        jobs[destination] = (file, lossless, full)
        provenance.append({'source': 'assets/drafts/high-fantasy/' + relative, 'published': '/assets/process/' + target.as_posix(), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest()})
    return '/assets/process/' + target.as_posix()
def title(value):
    value = value.replace('_', '-').replace('/', '-')
    value = re.sub(r'([a-z])([A-Z])', r'\1 \2', value)
    return ' '.join(x.upper() if re.fullmatch(r't[123]|hq', x, re.I) else x.capitalize() for x in re.split(r'[- ]+', value))

sprites, references, animations = [], [], []
for race in ['human', 'elf', 'goblin']:
    for kind, pattern in [('Characters', 'classes'), ('Outfits & equipment', 'class-outfits-and-gear'), ('Mounts & companions', 'mounts-and-beasts')]:
        file = source / f'characters/{race}/{race}-{pattern}-sprite-sheet-preview.png'
        sprites.append({'title': f'{race.capitalize()} · {kind}', 'faction': race, 'kind': kind, 'image': publish(file, full=True)})
    file = source / f'buildings/{race}/{race}-buildings-sprite-sheet-preview.png'
    sprites.append({'title': f'{race.capitalize()} · Buildings', 'faction': race, 'kind': 'Buildings', 'image': publish(file, full=True)})
    for category, folder in [('characters', source/f'characters/{race}/classes'), ('characters', source/f'characters/{race}/bases'), ('equipment', source/f'characters/{race}/equipment'), ('buildings', source/f'buildings/{race}')]:
        groups = {}
        for file in sorted(folder.rglob('*.png')):
            if any(part in ['revisions','renders','walk','rig-repair','mesh-repair','reviews','states','model','prepared'] for part in file.relative_to(folder).parts): continue
            match = re.search(r'[-_](front|left|back|right)$', file.stem)
            if match: groups.setdefault(file.parent, {})[match[1]] = file
        for directory, views in sorted(groups.items()):
            if set(views) != {'front', 'left', 'back', 'right'}: continue
            name = directory.relative_to(folder).as_posix()
            ident = re.sub(r'[^a-z0-9]+', '-', f'{race}-{category}-{folder.name}-{name}'.lower()).strip('-')
            references.append({'id': ident, 'asset': name, 'title': title(name), 'faction': race, 'category': category, 'family': folder.name, 'views': {direction: publish(views[direction]) for direction in ['front','left','back','right']}})

library = source/'characters/attack-flipbooks'
for item in json.loads((library/'catalog.json').read_text()):
    sequence_file = library / Path(item['preview']).parent / 'sequence.json'
    data = json.loads(sequence_file.read_text())
    sheets = []
    for sheet in data['sheets']:
        file = sequence_file.parent / sheet['file']
        if not file.is_file(): continue
        image = sheet.get('image', {})
        grid = image.get('grid')
        if not grid: raise ValueError(f'Missing grid: {file}')
        sheets.append({'name': file.name, 'purpose': sheet['purpose'], 'image': publish(file, lossless=True, full=True), 'grid': grid, 'keyframes': [{key: frame[key] for key in ['cell','source_frame','time_seconds','phase','timeline','source_action'] if key in frame} for frame in sheet['keyframes']]})
    if not sheets: continue
    ident = item['id']
    race, role, action = ident.split('.')
    animations.append({'id': ident.replace('.', '-'), 'sourceId': ident, 'title': title(ident.replace('.', '-')), 'faction': race, 'role': role, 'action': action, 'representative': data.get('representative',''), 'revision': data['revision'], 'sheets': sheets})

def convert(job):
    destination, (file, lossless, full) = job
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(file) as im:
        im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
        if not full: im.thumbnail((900,900), Image.Resampling.LANCZOS)
        im.save(destination, 'WEBP', lossless=lossless, quality=88, method=5, exact=True)
with ThreadPoolExecutor(max_workers=6) as pool:
    list(pool.map(convert, jobs.items()))
(repo/'content/media.json').write_text(json.dumps({'sprites': sprites, 'references': references, 'animations': animations, 'imageSizes': {'/assets/process/' + file.relative_to(media).as_posix(): list(Image.open(file).size) for file in jobs}}, indent=2)+'\n')
(repo/'content/media-provenance.json').write_text(json.dumps(provenance, indent=2)+'\n')
print(json.dumps({'spriteSheets':len(sprites),'fourViewSets':len(references),'animations':len(animations),'images':len(jobs),'megabytes':round(sum(f.stat().st_size for f in jobs)/1e6,1)}))
