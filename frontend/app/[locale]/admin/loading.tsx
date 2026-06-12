export default function AdminLoading() {
  return (
    <div className="w-full space-y-5">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse"
            style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
            <div className="h-1 rounded-full bg-slate-100 mb-4" />
            <div className="w-10 h-10 rounded-xl bg-slate-100 mb-3" />
            <div className="h-8 w-12 rounded-lg bg-slate-100 mb-2" />
            <div className="h-3 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
        <div className="px-6 py-3.5" style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbff' }}>
          <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse"
            style={{ borderBottom: '1px solid #f8faff' }}>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-slate-100" />
              <div className="h-2.5 w-48 rounded bg-slate-100" />
            </div>
            <div className="h-5 w-16 rounded-full bg-slate-100" />
            <div className="h-5 w-16 rounded-full bg-slate-100" />
            <div className="h-5 w-20 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
