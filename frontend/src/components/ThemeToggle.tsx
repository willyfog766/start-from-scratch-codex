import { useTheme } from '../store/theme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="border rounded px-2 py-1 text-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
