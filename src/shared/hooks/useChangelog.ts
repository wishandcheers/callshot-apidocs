import { useState, useEffect } from 'react';

import { fetchChangelog } from '@/shared/lib/api';

import type { ChangelogData } from '@/shared/types';

type ChangelogState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: ChangelogData }
  | { status: 'error'; error: Error };

export function useChangelog(from: string | null, to: string | null): ChangelogState {
  const [state, setState] = useState<ChangelogState>({ status: 'idle' });

  useEffect(() => {
    if (!from || !to) {
      setState({ status: 'idle' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    fetchChangelog(from, to)
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
  }, [from, to]);

  return state;
}
