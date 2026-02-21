/**
 * generate-diffs.mjs
 *
 * For each version, runs oasdiff against the previous WINDOW_SIZE versions to generate:
 *   - diff JSON (full structural diff)
 *   - changelog JSON (structured change entries)
 *   - breaking JSON (breaking changes only)
 *
 * Output goes to public/data/diffs/, public/data/changelogs/, public/data/breaking/
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SPECS_DIR = join(ROOT, 'specs');
const DATA_DIR = join(ROOT, 'public', 'data');

const DIFF_DIR = join(DATA_DIR, 'diffs');
const CHANGELOG_DIR = join(DATA_DIR, 'changelogs');
const BREAKING_DIR = join(DATA_DIR, 'breaking');

mkdirSync(DIFF_DIR, { recursive: true });
mkdirSync(CHANGELOG_DIR, { recursive: true });
mkdirSync(BREAKING_DIR, { recursive: true });

const SPEC_GROUPS = ['apiDocs-api.json', 'apiDocs-admin.json'];
const WINDOW_SIZE = 3;

const versions = readdirSync(SPECS_DIR)
  .filter((d) => d.startsWith('v'))
  .sort(compareVersions);

// Build version pairs: for each version, compare against previous WINDOW_SIZE versions
const pairs = [];
for (let i = 1; i < versions.length; i++) {
  const maxLookback = Math.min(WINDOW_SIZE, i);
  for (let j = 1; j <= maxLookback; j++) {
    pairs.push({ from: versions[i - j], to: versions[i] });
  }
}

console.log(`Processing ${versions.length} versions: ${versions.join(', ')}`);
console.log(`Window size: ${WINDOW_SIZE} → generating ${pairs.length} diff pairs\n`);

for (const { from, to } of pairs) {
  const pairKey = `${from}_${to}`;

  console.log(`--- ${from} → ${to} ---`);

  const pairResult = {
    fromVersion: from,
    toVersion: to,
    groups: {},
  };

  for (const specFile of SPEC_GROUPS) {
    const groupName = specFile.replace('apiDocs-', '').replace('.json', '');
    const fromSpec = join(SPECS_DIR, from, specFile);
    const toSpec = join(SPECS_DIR, to, specFile);

    // Diff
    const diffJson = runOasdiff('diff', fromSpec, toSpec, 'json');
    // Changelog
    const changelogJson = runOasdiff('changelog', fromSpec, toSpec, 'json');
    // Breaking
    const breakingJson = runOasdiff('breaking', fromSpec, toSpec, 'json');

    const diff = safeParseJson(diffJson);
    const changelog = safeParseJson(changelogJson);
    const breaking = safeParseJson(breakingJson);

    const summary = buildSummary(diff, changelog, breaking);

    pairResult.groups[groupName] = {
      diff,
      changelog,
      breaking,
      summary,
    };

    console.log(
      `  ${groupName}: +${summary.added} -${summary.removed} ~${summary.modified} !${summary.breaking}`,
    );
  }

  // Write combined diff file
  writeFileSync(join(DIFF_DIR, `${pairKey}.json`), JSON.stringify(pairResult, null, 2));

  // Write separate changelog and breaking files for convenience
  const changelogOut = {
    fromVersion: from,
    toVersion: to,
    groups: {},
  };
  const breakingOut = {
    fromVersion: from,
    toVersion: to,
    groups: {},
  };

  for (const [group, data] of Object.entries(pairResult.groups)) {
    changelogOut.groups[group] = data.changelog;
    breakingOut.groups[group] = data.breaking;
  }

  writeFileSync(join(CHANGELOG_DIR, `${pairKey}.json`), JSON.stringify(changelogOut, null, 2));
  writeFileSync(join(BREAKING_DIR, `${pairKey}.json`), JSON.stringify(breakingOut, null, 2));
}

console.log(`\nGenerated ${pairs.length} diff pairs in public/data/`);

function runOasdiff(command, fromSpec, toSpec, format) {
  try {
    const result = execSync(`oasdiff ${command} "${fromSpec}" "${toSpec}" -f ${format}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return result.trim();
  } catch (error) {
    // oasdiff exits with non-zero for breaking changes found
    if (error.stdout) {
      return error.stdout.trim();
    }
    console.warn(`  Warning: oasdiff ${command} failed for ${fromSpec} → ${toSpec}`);
    return command === 'diff' ? '{}' : '[]';
  }
}

function safeParseJson(str) {
  try {
    return JSON.parse(str || '{}');
  } catch {
    return str?.startsWith('[') ? [] : {};
  }
}

function buildSummary(diff, changelog, breaking) {
  const added = diff?.paths?.added?.length ?? 0;
  const removed = diff?.paths?.deleted?.length ?? 0;
  const modified = Object.keys(diff?.paths?.modified ?? {}).length;
  const breakingCount = Array.isArray(breaking) ? breaking.length : 0;

  return { added, removed, modified, breaking: breakingCount };
}

function compareVersions(a, b) {
  const pa = a.replace('v', '').split('.').map(Number);
  const pb = b.replace('v', '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}
