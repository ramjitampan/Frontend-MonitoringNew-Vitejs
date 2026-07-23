import { STATUS_VARIANTS } from "../../utils/constants"

export default function Badge({ status, children, className = "" }) {
  if (status && STATUS_VARIANTS[status]) {
    const v = STATUS_VARIANTS[status]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-body ${v.bg} ${v.text} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
        {status}
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-body bg-gray-50 text-gray-700 ${className}`}>
      {children || status || "-"}
    </span>
  )
}
