// components/ui/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border p-4 shadow-sm">
      <div className="h-40 w-full rounded-lg bg-gray-200" />
      <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
    </div>
  );
}
