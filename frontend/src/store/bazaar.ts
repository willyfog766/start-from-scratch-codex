import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BazaarStore {
  selectedItem: string | null;
  favorites: Set<string>;
  setSelectedItem: (id: string | null) => void;
  toggleFavorite: (id: string) => void;
}

export const useBazaarStore = create<BazaarStore>()(
  persist(
    (set) => ({
      selectedItem: null,
      favorites: new Set(),
      setSelectedItem: (id) => set({ selectedItem: id }),
      toggleFavorite: (id) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(id)) {
            newFavorites.delete(id);
          } else {
            newFavorites.add(id);
          }
          return { favorites: newFavorites };
        }),
    }),
    {
      name: 'bazaar-storage',
      partialize: (state) => ({
        selectedItem: state.selectedItem,
        favorites: Array.from(state.favorites),
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        favorites: new Set(persisted?.favorites || []),
      }),
    }
  )
);
