import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BazaarSocket } from './api/socket';
import { useBazaarStore } from './store/bazaar';
import { PredictionCard } from './components/PredictionCard';
import { ItemList } from './components/ItemList';
import { Chart } from './components/Chart';

const socket = new BazaarSocket();

export function App() {
  const queryClient = useQueryClient();
  const { selectedItem, setSelectedItem, favorites } = useBazaarStore();

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await fetch('/api/items');
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: itemDetails } = useQuery({
    queryKey: ['item', selectedItem],
    queryFn: async () => {
      const res = await fetch(`/api/items/${selectedItem}/full`);
      return res.json();
    },
    enabled: !!selectedItem,
  });

  useEffect(() => {
    if (selectedItem) {
      socket.subscribe(selectedItem, (data) => {
        queryClient.setQueryData(['item', selectedItem], data);
      });
    }
  }, [selectedItem, queryClient]);

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-3">
        <ItemList
          items={items}
          selectedItem={selectedItem}
          onSelect={setSelectedItem}
          favorites={favorites}
        />
      </div>

      {selectedItem && (
        <div className="col-span-9">
          <div className="grid grid-cols-2 gap-4">
            <Chart data={itemDetails?.history} />
            <PredictionCard itemId={selectedItem} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
