export default function ItemListSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border p-2 rounded animate-pulse">
          <div className="h-4 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
