import { useEffect } from "react";

export default function DeleteModal({ show, itemName, itemType, onConfirm, onCancel }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-wrap" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E2001A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h3 className="font-display font-bold text-lg text-ta-ink m-0 mb-1">
            Hapus {itemType}?
          </h3>
          <p className="text-sm text-ta-muted font-body m-0 mb-4">
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="w-full bg-gray-50 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm font-semibold text-ta-ink font-body m-0 truncate">
              {itemName}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="btn-primary flex-1"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
