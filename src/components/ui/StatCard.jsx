import { useState, useEffect, useRef } from "react"

export default function StatCard({ icon, label, value, color = "text-ta-red", subtitle, isRupiah }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplay(value)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true
            const duration = 1400
            const startTime = performance.now()
            function tick(now) {
              const progress = Math.min((now - startTime) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setDisplay(Math.floor(eased * value))
              if (progress < 1) requestAnimationFrame(tick)
              else setDisplay(value)
            }
            requestAnimationFrame(tick)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  function formatVal(v) {
    if (isRupiah) {
      if (v >= 1000000000) return "Rp " + (v / 1000000000).toFixed(1).replace(".", ",") + " M"
      if (v >= 1000000) return "Rp " + (v / 1000000).toFixed(1).replace(".", ",") + " Jt"
      return "Rp " + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
    return v.toLocaleString("id-ID")
  }

  return (
    <div ref={ref} className="stat-card bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-ta-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-ta-soft flex items-center justify-center text-ta-red shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-ta-muted font-body font-semibold m-0 truncate">
            {label}
          </p>
          <p className={`font-display font-bold text-lg sm:text-xl m-0 ${color} truncate`}>
            {typeof value === "number" ? formatVal(display) : display}
          </p>
          {subtitle && <p className="text-[10px] text-ta-muted font-body m-0">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
