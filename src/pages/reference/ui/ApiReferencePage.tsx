import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useVersions } from '@/shared/hooks';
import { cn } from '@/shared/lib/cn';

import { SpecTypeTabs, type SpecType } from './SpecTypeTabs';

const RedocStandalone = lazy(() =>
  import('redoc').then((m) => ({ default: m.RedocStandalone })),
);

const REDOC_OPTIONS = {
  theme: {
    colors: { primary: { main: '#3b82f6' } },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      headings: { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
      code: { fontFamily: 'JetBrains Mono, ui-monospace, monospace' },
    },
    sidebar: {
      backgroundColor: '#111827',
      textColor: '#94a3b8',
      activeTextColor: '#ffffff',
      groupItems: { activeBackgroundColor: '#1e293b', activeTextColor: '#ffffff' },
    },
    rightPanel: { backgroundColor: '#0a0a0a' },
    schema: { nestedBackground: '#111827' },
  },
  hideDownloadButton: true,
  nativeScrollbars: true,
  sortTagsAlphabetically: true,
} as const;

function buildSpecUrl(version: string, specType: SpecType): string {
  const fileName = specType === 'api' ? 'apiDocs-api.json' : 'apiDocs-internal.json';
  return `/data/specs/${version}/${fileName}`;
}

export function ApiReferencePage() {
  const { version } = useParams<{ version: string }>();
  const navigate = useNavigate();
  const versionsState = useVersions();
  const [specType, setSpecType] = useState<SpecType>('api');

  // Auto-redirect to latest version when no version param
  useEffect(() => {
    if (version) return;
    if (versionsState.status !== 'success') return;

    const versions = versionsState.data.versions;
    const latest = versions[versions.length - 1];
    if (latest) {
      void navigate(`/reference/${latest.version}`, { replace: true });
    }
  }, [version, versionsState, navigate]);

  if (versionsState.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (versionsState.status === 'error') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load version data: {versionsState.error.message}
      </div>
    );
  }

  const { versions } = versionsState.data;
  const versionIds = versions.map((v) => v.version);
  const currentVersion = version ?? versionIds[versionIds.length - 1];

  if (!currentVersion) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No versions available.
      </div>
    );
  }

  const specUrl = buildSpecUrl(currentVersion, specType);

  return (
    <div className="-m-6 flex flex-col">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4 border-b border-border bg-card px-6 py-3">
        <label className="text-sm font-medium text-muted-foreground">Version</label>
        <select
          value={currentVersion}
          onChange={(e) => void navigate(`/reference/${e.target.value}`)}
          aria-label="Select version"
          className={cn(
            'rounded-lg border border-border bg-background px-3 py-2',
            'font-mono text-sm text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'cursor-pointer',
          )}
        >
          {versionIds.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <SpecTypeTabs active={specType} onChange={setSpecType} />
      </div>

      {/* Redoc container */}
      <div className="min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <RedocStandalone
            key={`${currentVersion}-${specType}`}
            specUrl={specUrl}
            options={REDOC_OPTIONS}
          />
        </Suspense>
      </div>
    </div>
  );
}
