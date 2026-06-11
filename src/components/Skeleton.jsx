export default function Skeleton({ count = 6, height = "h-44" }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`card p-5 ${height}`}>
          <div className="flex gap-4">
            <div className="w-20 h-20 shimmer rounded-2xl" />
            <div className="flex-1 space-y-2 pt-2">
              <div className="h-4 shimmer rounded w-3/4" />
              <div className="h-3 shimmer rounded w-1/2" />
              <div className="h-3 shimmer rounded w-2/3" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <div className="h-2 shimmer rounded w-16" />
              <div className="h-5 shimmer rounded w-12" />
            </div>
            <div className="h-9 shimmer rounded-xl w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
