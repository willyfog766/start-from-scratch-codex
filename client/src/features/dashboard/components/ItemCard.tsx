interface Props {
  id: string;
  name: string;
}

export default function ItemCard({ id, name }: Props) {
  return (
    <div className="rounded border p-4" data-id={id}>
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">Price: --</div>
    </div>
  );
}
