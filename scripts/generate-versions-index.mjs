/**
 * generate-versions-index.mjs
 *
 * Reads individual meta files from public/data/meta/ and diff summaries
 * to produce the unified public/data/versions.json manifest.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'public', 'data');
const META_DIR = join(DATA_DIR, 'meta');
const DIFF_DIR = join(DATA_DIR, 'diffs');

mkdirSync(DATA_DIR, { recursive: true });

const metaFiles = readdirSync(META_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort((a, b) => compareVersions(a.replace('.json', ''), b.replace('.json', '')));

const versions = [];

for (const file of metaFiles) {
  const meta = JSON.parse(readFileSync(join(META_DIR, file), 'utf-8'));
  const version = meta.version;

  // Find diff summary where this version is the "to" version
  let diffSummary = null;
  const prevIdx = versions.length;

  if (prevIdx > 0) {
    const prevVersion = versions[prevIdx - 1].version;
    const diffFile = join(DIFF_DIR, `${prevVersion}_${version}.json`);

    if (existsSync(diffFile)) {
      const diffData = JSON.parse(readFileSync(diffFile, 'utf-8'));

      // Aggregate summaries across all spec groups
      const aggregated = { added: 0, removed: 0, modified: 0, breaking: 0 };
      for (const groupData of Object.values(diffData.groups ?? {})) {
        const s = groupData.summary ?? {};
        aggregated.added += s.added ?? 0;
        aggregated.removed += s.removed ?? 0;
        aggregated.modified += s.modified ?? 0;
        aggregated.breaking += s.breaking ?? 0;
      }

      diffSummary = {
        previousVersion: prevVersion,
        summary: aggregated,
      };
    }
  }

  versions.push({
    version,
    specVersion: meta.specVersion,
    releasedAt: meta.releasedAt,
    stats: meta.stats,
    diff: diffSummary,
  });
}

const manifest = {
  serviceName: 'gloview-api',
  generatedAt: new Date().toISOString(),
  totalVersions: versions.length,
  versions,
};

const outPath = join(DATA_DIR, 'versions.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(`Generated versions.json with ${versions.length} versions`);
for (const v of versions) {
  const diffInfo = v.diff
    ? ` (diff from ${v.diff.previousVersion}: +${v.diff.summary.added} -${v.diff.summary.removed} ~${v.diff.summary.modified} !${v.diff.summary.breaking})`
    : ' (first version)';
  console.log(`  ${v.version}${diffInfo}`);
}

function compareVersions(a, b) {
  const pa = a.replace('v', '').split('.').map(Number);
  const pb = b.replace('v', '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}
