import { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggle: () =>
    set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));

const ThemeContext = createContext(useThemeStore);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const store = useThemeStore;
  const theme = store.getState().theme;
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext)();
}
