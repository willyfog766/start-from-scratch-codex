import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-56 border-r p-4 hidden md:block">
      <nav className="space-y-2">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/analytics/top-movers" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
          Analytics
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
          Alerts
        </NavLink>
      </nav>
    </aside>
  );
}
