import { useState, useEffect } from 'react';

import { fetchDiff } from '@/shared/lib/api';

import type { DiffData } from '@/shared/types';

type DiffState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: DiffData }
  | { status: 'error'; error: Error };

export function useDiff(from: string | null, to: string | null): DiffState {
  const [state, setState] = useState<DiffState>({ status: 'idle' });

  useEffect(() => {
    if (!from || !to) {
      setState({ status: 'idle' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    fetchDiff(from, to)
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
