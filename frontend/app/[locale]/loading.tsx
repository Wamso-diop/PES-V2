export default function Loading() {
  return (
    <>
      {/* Progress bar at the very top */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
        style={{ background: 'linear-gradient(90deg, #1e40af, #7c3aed, #1e40af)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }}>
      </div>

      {/* Page skeleton */}
      <div className="min-h-screen bg-white pt-[72px]">
        {/* Hero skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-lg space-y-5">
            <div className="h-5 w-28 rounded-full bg-slate-100 animate-pulse" />
            <div className="space-y-3">
              <div className="h-10 w-3/4 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-10 w-1/2 rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="h-4 w-full rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-100 animate-pulse" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-36 rounded-full bg-blue-100 animate-pulse" />
              <div className="h-12 w-36 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
