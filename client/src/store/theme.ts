import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggle: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
