export default function Loading() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-pulse">
      {/* Back link */}
      <div className="h-4 w-28 bg-gray-200 rounded mb-6" />

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
                <div className="h-4 bg-gray-100 rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
