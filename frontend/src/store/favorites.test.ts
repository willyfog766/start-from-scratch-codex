import { describe, it, expect } from 'vitest';
import { useFavorites } from './favorites';

describe('favorites store', () => {
  it('adds and removes items', () => {
    const { toggle, items } = useFavorites.getState();
    expect(items).toEqual([]);
    toggle('TEST');
    expect(useFavorites.getState().items).toEqual(['TEST']);
    toggle('TEST');
    expect(useFavorites.getState().items).toEqual([]);
  });
});
