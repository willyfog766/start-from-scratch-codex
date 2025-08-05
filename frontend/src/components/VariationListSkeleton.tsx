export default function VariationListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex justify-between border-b pb-1 animate-pulse">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-4 w-10 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
