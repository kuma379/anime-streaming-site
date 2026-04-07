export default function LoadingGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-[#111118] border border-white/5 animate-pulse">
          <div className="bg-[#1a1a2e]" style={{ aspectRatio: "3/4" }} />
          <div className="p-2.5 space-y-2">
            <div className="h-3 bg-[#1a1a2e] rounded w-full" />
            <div className="h-3 bg-[#1a1a2e] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
