import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/widgets/app-shell';
import { DashboardPage } from '@/pages/dashboard';
import { ChangelogPage } from '@/pages/changelog';
import { DiffPage } from '@/pages/diff';

const ApiReferencePage = lazy(() =>
  import('@/pages/reference').then((m) => ({ default: m.ApiReferencePage })),
);

function LazyApiReference() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ApiReferencePage />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'changelog', element: <ChangelogPage /> },
      { path: 'diff', element: <DiffPage /> },
      { path: 'diff/:from/:to', element: <DiffPage /> },
      { path: 'reference', element: <LazyApiReference /> },
      { path: 'reference/:version', element: <LazyApiReference /> },
    ],
  },
]);
