import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <span className="font-bold">SkyBlock Market</span>
      <ThemeToggle />
    </header>
  );
}
