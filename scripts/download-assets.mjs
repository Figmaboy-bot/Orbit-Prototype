// Downloads the Figma design assets into public/assets. Run with: node scripts/download-assets.mjs
import { execFile } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icons, avatars } from './assets-manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');
const base = 'https://www.figma.com/api/mcp/asset/';

const jobs = [];
for (const [name, [light, dark]] of Object.entries(icons)) {
  jobs.push([light, join(root, `${name}.svg`)]);
  if (dark) jobs.push([dark, join(root, `${name}.dark.svg`)]);
}
for (const [who, ids] of Object.entries(avatars)) {
  ids.forEach((id, i) => jobs.push([id, join(root, 'avatars', who, `${i}.svg`)]));
}

// Some figma.com CDN edges time out on certain networks, so pin each request
// to an edge that answers (via curl --resolve) and retry across edges.
const run = promisify(execFile);
const { stdout: dig } = await run('dig', ['+short', 'www.figma.com']).catch(() => ({ stdout: '' }));
const edges = dig.split('\n').filter((l) => /^\d+\.\d+\.\d+\.\d+$/.test(l));
const live = [];
for (const ip of edges) {
  const ok = await run('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '6',
    '--resolve', `www.figma.com:443:${ip}`, 'https://www.figma.com/']).then((r) => r.stdout === '200', () => false);
  if (ok) live.push(ip);
}
const pins = live.length ? live : [null];

let failed = 0;
async function fetchOne([id, out], n) {
  await mkdir(dirname(out), { recursive: true });
  for (let attempt = 0; attempt < pins.length * 2; attempt++) {
    const ip = pins[(n + attempt) % pins.length];
    const args = ['-sf', '--max-time', '20', '-o', out, `${base}${id}.svg`];
    if (ip) args.unshift('--resolve', `www.figma.com:443:${ip}`);
    const ok = await run('curl', args).then(() => true, () => false);
    if (ok && (await stat(out)).size > 0) return;
  }
  failed++;
  console.error(`FAIL ${out}`);
}

for (let i = 0; i < jobs.length; i += 12) {
  await Promise.all(jobs.slice(i, i + 12).map((job, k) => fetchOne(job, i + k)));
}
console.log(`${jobs.length - failed}/${jobs.length} assets downloaded`);
if (failed) process.exit(1);
