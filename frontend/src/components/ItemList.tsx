import type { BazaarItem } from '../types/bazaar';

interface Props {
  items?: BazaarItem[];
  selectedItem: string | null;
  onSelect: (id: string) => void;
  favorites: Set<string>;
}

export function ItemList({ items, selectedItem, onSelect, favorites }: Props) {
  if (!items) return <div>Loading...</div>;
  return (
    <ul className="space-y-1 max-h-screen overflow-y-auto">
      {items.map((item) => (
        <li
          key={item.id}
          className={`flex justify-between p-2 cursor-pointer rounded ${
            selectedItem === item.id ? 'bg-blue-100' : ''
          }`}
          onClick={() => onSelect(item.id)}
        >
          <span>{item.id}</span>
          {favorites.has(item.id) && <span>★</span>}
        </li>
      ))}
    </ul>
  );
}
