import { useState, useEffect } from 'react';

import { fetchVersions } from '@/shared/lib/api';

import type { VersionManifest } from '@/shared/types';

type VersionsState =
  | { status: 'loading' }
  | { status: 'success'; data: VersionManifest }
  | { status: 'error'; error: Error };

export function useVersions(): VersionsState {
  const [state, setState] = useState<VersionsState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchVersions()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
