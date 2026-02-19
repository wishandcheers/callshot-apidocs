import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { VersionEntry } from '@/shared/types';

type VersionPickerProps = {
  versions: VersionEntry[];
  from: string | null;
  to: string | null;
};

export function VersionPicker({ versions, from, to }: VersionPickerProps) {
  const navigate = useNavigate();
  const versionIds = versions.map((v) => v.version);

  const handleFromChange = (newFrom: string) => {
    const target = to ?? getNextVersion(newFrom, versionIds);
    if (target) {
      void navigate(`/diff/${newFrom}/${target}`);
    }
  };

  const handleToChange = (newTo: string) => {
    const source = from ?? getPreviousVersion(newTo, versionIds);
    if (source) {
      void navigate(`/diff/${source}/${newTo}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      <label className="text-sm font-medium text-muted-foreground">Compare</label>
      <VersionSelect
        value={from ?? ''}
        versions={versionIds}
        onChange={handleFromChange}
        aria-label="From version"
      />
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
      <VersionSelect
        value={to ?? ''}
        versions={versionIds}
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

function getNextVersion(version: string, versions: string[]): string | undefined {
  const idx = versions.indexOf(version);
  return idx >= 0 && idx < versions.length - 1 ? versions[idx + 1] : undefined;
}

function getPreviousVersion(version: string, versions: string[]): string | undefined {
  const idx = versions.indexOf(version);
  return idx > 0 ? versions[idx - 1] : undefined;
}
