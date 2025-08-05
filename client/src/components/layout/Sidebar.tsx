import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="hidden w-60 border-r p-4 md:block">
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>
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
