import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ItemPage } from '../features/item/pages/ItemPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { AlertsPage } from '../features/alerts/pages/AlertsPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/item/:id', element: <ItemPage /> },
      { path: '/analytics/top-movers', element: <AnalyticsPage /> },
      { path: '/alerts', element: <AlertsPage /> },
    ],
  },
]);
