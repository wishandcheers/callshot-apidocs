import { Layers, Route, AlertTriangle, GitBranch } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

import type { VersionManifest } from '@/shared/types';

type StatsCardsProps = {
  data: VersionManifest;
};

export function StatsCards({ data }: StatsCardsProps) {
  const { versions } = data;
  const latest = versions[versions.length - 1];
  const totalBreaking = versions.reduce(
    (sum, v) => sum + (v.diff?.summary.breaking ?? 0),
    0,
  );
  const totalAdded = versions.reduce(
    (sum, v) => sum + (v.diff?.summary.added ?? 0),
    0,
  );

  const cards = [
    {
      label: 'Total Versions',
      value: versions.length,
      icon: Layers,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'API Endpoints',
      value: latest?.stats.api.endpointCount ?? 0,
      icon: Route,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Breaking Changes',
      value: totalBreaking,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Endpoints Added',
      value: totalAdded,
      icon: GitBranch,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, bgColor }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn('rounded-lg p-2', bgColor)}>
              <Icon className={cn('h-4 w-4', color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
