export type VersionStats = {
  api: {
    pathCount: number;
    endpointCount: number;
  };
  admin: {
    pathCount: number;
    endpointCount: number;
  };
  schemaCount: number;
  tagCount: number;
};

export type DiffSummary = {
  added: number;
  removed: number;
  modified: number;
  breaking: number;
};

export type VersionEntry = {
  version: string;
  specVersion: string;
  releasedAt: string | null;
  stats: VersionStats;
  diff: {
    previousVersion: string;
    summary: DiffSummary;
  } | null;
};

export type VersionManifest = {
  serviceName: string;
  generatedAt: string;
  totalVersions: number;
  versions: VersionEntry[];
  availableDiffPairs: string[];
};
