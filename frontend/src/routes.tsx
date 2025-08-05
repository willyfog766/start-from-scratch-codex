import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Item from './pages/Item';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'item/:id', element: <Item /> },
      { path: 'analytics/top-movers', element: <Analytics /> },
      { path: 'alerts', element: <Alerts /> },
    ],
  },
]);
