import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useVersions, useTheme } from '@/shared/hooks';
import { cn } from '@/shared/lib/cn';

import { SpecTypeTabs, type SpecType } from './SpecTypeTabs';

const RedocStandalone = lazy(() =>
  import('redoc').then((m) => ({ default: m.RedocStandalone })),
);

const REDOC_SHARED = {
  hideDownloadButton: true,
  nativeScrollbars: true,
  sortTagsAlphabetically: true,
} as const;

const REDOC_TYPOGRAPHY = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  headings: { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  code: { fontFamily: 'JetBrains Mono, ui-monospace, monospace' },
} as const;

function buildRedocOptions(resolved: 'light' | 'dark') {
  if (resolved === 'dark') {
    return {
      ...REDOC_SHARED,
      theme: {
        colors: {
          primary: { main: '#3b82f6' },
          text: { primary: '#e2e8f0', secondary: '#94a3b8' },
          border: { dark: '#334155', light: '#1e293b' },
        },
        typography: {
          ...REDOC_TYPOGRAPHY,
          code: {
            ...REDOC_TYPOGRAPHY.code,
            color: '#e2e8f0',
            backgroundColor: '#1e293b',
          },
          links: { color: '#60a5fa', visited: '#60a5fa', hover: '#93bbfd' },
        },
        sidebar: {
          backgroundColor: '#111827',
          textColor: '#94a3b8',
          activeTextColor: '#ffffff',
          groupItems: {
            activeBackgroundColor: '#1e293b',
            activeTextColor: '#ffffff',
          },
        },
        rightPanel: { backgroundColor: '#0a0a0a', textColor: '#e2e8f0' },
        schema: {
          nestedBackground: '#111827',
          linesColor: '#334155',
          typeNameColor: '#93c5fd',
          typeTitleColor: '#e2e8f0',
          requireLabelColor: '#ef4444',
        },
      },
    };
  }

  return {
    ...REDOC_SHARED,
    theme: {
      colors: { primary: { main: '#3b82f6' } },
      typography: REDOC_TYPOGRAPHY,
      sidebar: {
        backgroundColor: '#f8fafc',
        textColor: '#64748b',
        activeTextColor: '#0f172a',
        groupItems: {
          activeBackgroundColor: '#e2e8f0',
          activeTextColor: '#0f172a',
        },
      },
      rightPanel: { backgroundColor: '#263238' },
      schema: { nestedBackground: '#f1f5f9' },
    },
  };
}

function buildSpecUrl(version: string, specType: SpecType): string {
  const fileName = specType === 'api' ? 'apiDocs-api.json' : 'apiDocs-internal.json';
  return `/data/specs/${version}/${fileName}`;
}

export function ApiReferencePage() {
  const { version } = useParams<{ version: string }>();
  const navigate = useNavigate();
  const versionsState = useVersions();
  const { resolved } = useTheme();
  const [specType, setSpecType] = useState<SpecType>('api');

  const redocOptions = useMemo(() => buildRedocOptions(resolved), [resolved]);

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
            key={`${currentVersion}-${specType}-${resolved}`}
            specUrl={specUrl}
            options={redocOptions}
          />
        </Suspense>
      </div>
    </div>
  );
}
