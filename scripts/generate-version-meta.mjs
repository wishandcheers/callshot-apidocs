/**
 * generate-version-meta.mjs
 *
 * Extracts per-version metadata (endpoint count, schema count, tag count)
 * from each spec in specs/ and writes individual meta JSON files to public/data/meta/.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SPECS_DIR = join(ROOT, 'specs');
const META_DIR = join(ROOT, 'public', 'data', 'meta');

mkdirSync(META_DIR, { recursive: true });

const versions = readdirSync(SPECS_DIR)
  .filter((d) => d.startsWith('v'))
  .sort(compareVersions);

console.log(`Found ${versions.length} versions: ${versions.join(', ')}`);

for (const version of versions) {
  const specDir = join(SPECS_DIR, version);

  // Read API spec
  const apiSpecPath = join(specDir, 'apiDocs-api.json');
  const internalSpecPath = join(specDir, 'apiDocs-internal.json');
  const metadataPath = join(specDir, 'service-metadata.json');

  const apiSpec = JSON.parse(readFileSync(apiSpecPath, 'utf-8'));
  const internalSpec = existsSync(internalSpecPath)
    ? JSON.parse(readFileSync(internalSpecPath, 'utf-8'))
    : null;

  const serviceMetadata = existsSync(metadataPath)
    ? JSON.parse(readFileSync(metadataPath, 'utf-8'))
    : null;

  const apiPaths = Object.keys(apiSpec.paths ?? {});
  const internalPaths = internalSpec ? Object.keys(internalSpec.paths ?? {}) : [];

  // Count unique endpoints (method + path)
  const apiEndpointCount = countEndpoints(apiSpec);
  const internalEndpointCount = internalSpec ? countEndpoints(internalSpec) : 0;

  const schemas = apiSpec.components?.schemas ?? {};
  const tags = apiSpec.tags ?? [];

  const meta = {
    version,
    specVersion: apiSpec.info?.version ?? version.replace('v', ''),
    releasedAt: serviceMetadata?.generated_at ?? null,
    stats: {
      api: {
        pathCount: apiPaths.length,
        endpointCount: apiEndpointCount,
      },
      internal: {
        pathCount: internalPaths.length,
        endpointCount: internalEndpointCount,
      },
      schemaCount: Object.keys(schemas).length,
      tagCount: tags.length,
    },
  };

  const outPath = join(META_DIR, `${version}.json`);
  writeFileSync(outPath, JSON.stringify(meta, null, 2));
  console.log(
    `  ${version}: ${apiEndpointCount} API + ${internalEndpointCount} internal endpoints, ${Object.keys(schemas).length} schemas`,
  );
}

console.log(`\nGenerated ${versions.length} meta files in public/data/meta/`);

/** Count total endpoints (each HTTP method on each path = 1 endpoint) */
function countEndpoints(spec) {
  let count = 0;
  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const key of Object.keys(pathItem)) {
      if (['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(key)) {
        count++;
      }
    }
  }
  return count;
}

/** Sort version strings (v0.2.1, v0.2.2, ..., v0.9.0) */
function compareVersions(a, b) {
  const pa = a.replace('v', '').split('.').map(Number);
  const pb = b.replace('v', '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}
