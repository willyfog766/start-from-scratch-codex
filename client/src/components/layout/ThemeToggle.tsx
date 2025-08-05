import { useThemeStore } from '../../store/theme';

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  return (
    <button onClick={toggle} aria-label="Toggle theme">
      {theme === 'light' ? '🌞' : '🌙'}
    </button>
  );
}
