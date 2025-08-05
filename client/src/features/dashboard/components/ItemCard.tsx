interface ItemCardProps {
  name: string;
}

export function ItemCard({ name }: ItemCardProps) {
  return (
    <div className="rounded border p-2 shadow-sm">
      {name}
    </div>
  );
}
