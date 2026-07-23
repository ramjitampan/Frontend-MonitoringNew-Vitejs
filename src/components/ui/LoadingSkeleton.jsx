export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-ta-border">
          <div className="shimmer-bar w-3/4 mb-3" />
          <div className="shimmer-bar w-1/2 mb-2" />
          <div className="shimmer-bar w-1/4" />
        </div>
      ))}
    </div>
  )
}
