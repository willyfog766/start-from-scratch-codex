import { useParams } from 'react-router-dom';

export function ItemPage() {
  const { id } = useParams();
  return <div>Item {id}</div>;
}
