import type { VersionManifest, ChangelogData, BreakingData, DiffData } from '@/shared/types';

const DATA_BASE = '/data';

export async function fetchVersions(): Promise<VersionManifest> {
  const res = await fetch(`${DATA_BASE}/versions.json`);
  if (!res.ok) throw new Error(`Failed to fetch versions: ${res.status}`);
  return res.json() as Promise<VersionManifest>;
}

export async function fetchChangelog(from: string, to: string): Promise<ChangelogData> {
  const res = await fetch(`${DATA_BASE}/changelogs/${from}_${to}.json`);
  if (!res.ok) throw new Error(`Failed to fetch changelog ${from}_${to}: ${res.status}`);
  return res.json() as Promise<ChangelogData>;
}

export async function fetchBreaking(from: string, to: string): Promise<BreakingData> {
  const res = await fetch(`${DATA_BASE}/breaking/${from}_${to}.json`);
  if (!res.ok) throw new Error(`Failed to fetch breaking ${from}_${to}: ${res.status}`);
  return res.json() as Promise<BreakingData>;
}

export async function fetchDiff(from: string, to: string): Promise<DiffData> {
  const res = await fetch(`${DATA_BASE}/diffs/${from}_${to}.json`);
  if (!res.ok) throw new Error(`Failed to fetch diff ${from}_${to}: ${res.status}`);
  return res.json() as Promise<DiffData>;
}
