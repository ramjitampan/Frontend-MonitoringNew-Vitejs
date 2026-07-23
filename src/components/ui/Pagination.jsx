export default function Pagination({ page, lastPage, total, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-ta-muted font-body m-0">
        Halaman {page} dari {lastPage} ({total} data)
      </p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="px-4 py-2 rounded-xl border border-ta-border text-sm font-body font-semibold text-ta-muted bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Sebelumnya
        </button>
        <button
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 rounded-xl border border-ta-border text-sm font-body font-semibold text-ta-muted bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  )
}
