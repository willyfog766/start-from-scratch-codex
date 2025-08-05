import { useParams } from 'react-router-dom';

export default function Item() {
  const { id } = useParams();
  return <div>Item page for {id}</div>;
}
