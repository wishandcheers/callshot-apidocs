import type { ChangelogEntry } from './changelog';
import type { DiffSummary } from './version';

export type StringChange = {
  from: string;
  to: string;
};

export type AddedDeleted = {
  added?: string[];
  deleted?: string[];
};

export type SchemaModification = {
  description?: StringChange;
  required?: AddedDeleted;
  properties?: AddedDeleted & {
    modified?: Record<string, SchemaModification>;
  };
  items?: SchemaModification;
};

export type OperationDiff = {
  tags?: AddedDeleted;
  summary?: StringChange;
  description?: StringChange;
  operationID?: StringChange;
  parameters?: {
    modified?: Record<string, Record<string, Record<string, unknown>>>;
  };
  requestBody?: Record<string, unknown>;
  responses?: {
    modified?: Record<string, Record<string, unknown>>;
  };
};

export type PathDiff = {
  operations?: {
    added?: string[];
    deleted?: string[];
    modified?: Record<string, OperationDiff>;
  };
};

export type RawDiff = {
  info?: {
    title?: StringChange;
    description?: StringChange;
    version?: StringChange;
  };
  servers?: AddedDeleted;
  tags?: AddedDeleted;
  paths?: {
    added?: string[];
    deleted?: string[];
    modified?: Record<string, PathDiff>;
  };
  components?: {
    schemas?: {
      added?: string[];
      deleted?: string[];
      modified?: Record<string, SchemaModification>;
    };
  };
};

export type GroupDiff = {
  diff: RawDiff;
  changelog: ChangelogEntry[];
  breaking: ChangelogEntry[];
  summary: DiffSummary;
};

export type DiffData = {
  fromVersion: string;
  toVersion: string;
  groups: {
    api: GroupDiff;
    admin: GroupDiff;
  };
};
