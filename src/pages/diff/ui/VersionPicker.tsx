import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { VersionEntry } from '@/shared/types';

type VersionPickerProps = {
  versions: VersionEntry[];
  from: string | null;
  to: string | null;
  availableDiffPairs: string[];
};

export function VersionPicker({ versions, from, to, availableDiffPairs }: VersionPickerProps) {
  const navigate = useNavigate();
  const versionIds = versions.map((v) => v.version);
  const pairSet = useMemo(() => new Set(availableDiffPairs), [availableDiffPairs]);

  // Filter "to" versions based on selected "from"
  const availableToVersions = useMemo(() => {
    if (!from) return versionIds;
    return versionIds.filter((v) => pairSet.has(`${from}_${v}`));
  }, [from, versionIds, pairSet]);

  // Filter "from" versions based on selected "to"
  const availableFromVersions = useMemo(() => {
    if (!to) return versionIds;
    return versionIds.filter((v) => pairSet.has(`${v}_${to}`));
  }, [to, versionIds, pairSet]);

  const handleFromChange = (newFrom: string) => {
    // Pick closest available "to" version
    const target = to && pairSet.has(`${newFrom}_${to}`)
      ? to
      : getNextAvailable(newFrom, versionIds, pairSet);
    if (target) {
      void navigate(`/diff/${newFrom}/${target}`);
    }
  };

  const handleToChange = (newTo: string) => {
    // Pick closest available "from" version
    const source = from && pairSet.has(`${from}_${newTo}`)
      ? from
      : getPreviousAvailable(newTo, versionIds, pairSet);
    if (source) {
      void navigate(`/diff/${source}/${newTo}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      <label className="text-sm font-medium text-muted-foreground">Compare</label>
      <VersionSelect
        value={from ?? ''}
        versions={availableFromVersions}
        onChange={handleFromChange}
        aria-label="From version"
      />
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
      <VersionSelect
        value={to ?? ''}
        versions={availableToVersions}
        onChange={handleToChange}
        aria-label="To version"
      />
    </div>
  );
}

function VersionSelect({
  value,
  versions,
  onChange,
  'aria-label': ariaLabel,
}: {
  value: string;
  versions: string[];
  onChange: (v: string) => void;
  'aria-label': string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={cn(
        'rounded-lg border border-border bg-background px-3 py-2',
        'font-mono text-sm text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'cursor-pointer',
      )}
    >
      <option value="" disabled>
        Select version
      </option>
      {versions.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}

function getNextAvailable(version: string, versions: string[], pairSet: Set<string>): string | undefined {
  const idx = versions.indexOf(version);
  if (idx < 0) return undefined;
  // Search forward for the closest available "to" version
  for (let i = idx + 1; i < versions.length; i++) {
    if (pairSet.has(`${version}_${versions[i]}`)) return versions[i];
  }
  return undefined;
}

function getPreviousAvailable(version: string, versions: string[], pairSet: Set<string>): string | undefined {
  const idx = versions.indexOf(version);
  if (idx < 0) return undefined;
  // Search backward for the closest available "from" version
  for (let i = idx - 1; i >= 0; i--) {
    if (pairSet.has(`${versions[i]}_${version}`)) return versions[i];
  }
  return undefined;
}
