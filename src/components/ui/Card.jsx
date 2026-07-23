export default function Card({ children, className = "", padding = true, hover = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-ta-border ${padding ? "p-4 sm:p-5" : ""} ${hover ? "hover:shadow-lg transition-shadow" : ""} ${className}`}>
      {children}
    </div>
  )
}
