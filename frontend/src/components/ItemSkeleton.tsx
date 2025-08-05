export default function ItemSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-300 rounded" />
      <ul className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="h-4 bg-gray-300 rounded" />
        ))}
      </ul>
    </div>
  );
}
