import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/widgets/app-shell';
import { DashboardPage } from '@/pages/dashboard';
import { ChangelogPage } from '@/pages/changelog';
import { DiffPage } from '@/pages/diff';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'changelog', element: <ChangelogPage /> },
      { path: 'diff', element: <DiffPage /> },
      { path: 'diff/:from/:to', element: <DiffPage /> },
      {
        path: 'reference',
        element: (
          <div className="text-muted-foreground">
            API Reference — coming in Phase 4
          </div>
        ),
      },
      {
        path: 'reference/:version',
        element: (
          <div className="text-muted-foreground">
            API Reference — coming in Phase 4
          </div>
        ),
      },
    ],
  },
]);
