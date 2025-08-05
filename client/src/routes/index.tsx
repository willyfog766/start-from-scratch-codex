import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const ItemPage = lazy(() => import('../features/item/pages/ItemPage'));
const AnalyticsPage = lazy(() => import('../features/analytics/pages/AnalyticsPage'));
const AlertsPage = lazy(() => import('../features/alerts/pages/AlertsPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'item/:id', element: <ItemPage /> },
      { path: 'analytics/top-movers', element: <AnalyticsPage /> },
      { path: 'alerts', element: <AlertsPage /> },
    ],
  },
]);
