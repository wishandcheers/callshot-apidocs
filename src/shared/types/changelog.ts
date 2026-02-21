export type ChangelogEntry = {
  id: string;
  text: string;
  level: number;
  operation: string;
  operationId: string;
  path: string;
  source: string;
  section: string;
};

export type ChangelogData = {
  fromVersion: string;
  toVersion: string;
  groups: {
    api: ChangelogEntry[];
    admin: ChangelogEntry[];
  };
};

export type BreakingEntry = {
  id: string;
  text: string;
  level: number;
  operation: string;
  operationId: string;
  path: string;
  source: string;
  section: string;
};

export type BreakingData = {
  fromVersion: string;
  toVersion: string;
  groups: {
    api: BreakingEntry[];
    admin: BreakingEntry[];
  };
};
