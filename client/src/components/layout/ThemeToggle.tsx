import { useThemeStore } from '../../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  return (
    <button onClick={toggle} aria-label="Toggle Theme" className="p-2">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
