import { describe, it, expect, beforeEach } from 'vitest';
import { useBazaarStore } from './bazaar';

describe('bazaar store', () => {
  beforeEach(() => {
    useBazaarStore.setState({ selectedItem: null, favorites: new Set() });
  });

  it('toggles favorites', () => {
    const { toggleFavorite } = useBazaarStore.getState();
    toggleFavorite('TEST');
    expect(Array.from(useBazaarStore.getState().favorites)).toEqual(['TEST']);
    toggleFavorite('TEST');
    expect(Array.from(useBazaarStore.getState().favorites)).toEqual([]);
  });

  it('sets selected item', () => {
    const { setSelectedItem } = useBazaarStore.getState();
    setSelectedItem('ITEM1');
    expect(useBazaarStore.getState().selectedItem).toBe('ITEM1');
  });
});
