/**
 * copy-specs-to-public.mjs
 *
 * Copies OpenAPI spec files from specs/{version}/ to public/data/specs/{version}/
 * so that Redoc can load them at runtime.
 */

import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SPECS_DIR = join(ROOT, 'specs');
const OUT_DIR = join(ROOT, 'public', 'data', 'specs');

const SPEC_FILES = ['apiDocs-api.json', 'apiDocs-admin.json'];

const versions = readdirSync(SPECS_DIR).filter((d) =>
  d.startsWith('v') && existsSync(join(SPECS_DIR, d, SPEC_FILES[0]))
);

let copied = 0;

for (const version of versions) {
  const outVersionDir = join(OUT_DIR, version);
  mkdirSync(outVersionDir, { recursive: true });

  for (const file of SPEC_FILES) {
    const src = join(SPECS_DIR, version, file);
    if (existsSync(src)) {
      copyFileSync(src, join(outVersionDir, file));
      copied++;
    }
  }
}

console.log(`Copied ${copied} spec files across ${versions.length} versions to public/data/specs/`);
