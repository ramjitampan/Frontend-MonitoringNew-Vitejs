export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card bg-white rounded-2xl border border-ta-border p-7 hover:shadow-xl">
      <div className="feature-icon w-12 h-12 rounded-2xl bg-ta-soft text-ta-red flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-display font-bold text-[1.05rem] mb-2 text-ta-ink">{title}</h3>
      <p className="text-ta-muted text-[0.9rem] leading-relaxed">{description}</p>
    </div>
  )
}
