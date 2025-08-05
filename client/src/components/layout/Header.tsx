import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="font-bold">Hypixel Bazaar</div>
      <ThemeToggle />
    </header>
  );
}
