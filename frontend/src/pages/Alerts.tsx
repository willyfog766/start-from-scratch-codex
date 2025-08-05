import { useState } from 'react';
import { useBazaarStore } from '../store/bazaar';

export default function Alerts() {
  const { favorites, toggleFavorite } = useBazaarStore();
  const [input, setInput] = useState('');
  const items = Array.from(favorites);

  return (
    <div className="space-y-4 max-w-sm">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-1 flex-1"
          placeholder="Item ID"
        />
        <button
          onClick={() => {
            if (input) {
              toggleFavorite(input.toUpperCase());
              setInput('');
            }
          }}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((id) => (
          <li
            key={id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>{id}</span>
            <button
              onClick={() => toggleFavorite(id)}
              className="text-sm text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
        {items.length === 0 && <li>No alerts yet.</li>}
      </ul>
    </div>
  );
}
