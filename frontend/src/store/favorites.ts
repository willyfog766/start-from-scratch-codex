import { create } from 'zustand';

interface FavoritesState {
  items: string[];
  toggle: (id: string) => void;
}

export const useFavorites = create<FavoritesState>((set) => ({
  items: [],
  toggle: (id) =>
    set((s) => ({
      items: s.items.includes(id)
        ? s.items.filter((i) => i !== id)
        : [...s.items, id],
    })),
}));
