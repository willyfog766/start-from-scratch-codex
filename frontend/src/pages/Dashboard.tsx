import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Item {
  id: string;
  name: string;
}

export default function Dashboard() {
  const { data } = useQuery<Item[]>(['items'], async () => {
    const res = await axios.get('/items');
    return res.data;
  });

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {data?.map((item) => (
        <div key={item.id} className="border p-2 rounded">
          {item.name}
        </div>
      ))}
    </div>
  );
}
