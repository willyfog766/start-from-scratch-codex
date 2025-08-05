import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
