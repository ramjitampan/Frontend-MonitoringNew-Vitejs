import { Link } from "react-router-dom"

export default function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-ta-border p-12 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-ta-soft flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-display font-bold text-lg text-ta-ink m-0 mb-1">{title}</h3>
      {description && <p className="text-sm text-ta-muted font-body m-0 mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary no-underline inline-flex">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className="btn-primary border-none cursor-pointer">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
