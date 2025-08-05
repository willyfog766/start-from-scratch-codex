import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="font-bold">Bazaar Tracker</div>
      <ThemeToggle />
    </header>
  );
}
