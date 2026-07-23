export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="hero-bg px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-10 lg:pb-14 relative overflow-hidden">
      <div className="wrap relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow text-white/80">{eyebrow}</p>}
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white m-0">
              {title}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-white/70 font-body mt-1 max-w-xl">
                {description}
              </p>
            )}
          </div>
          {children && <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">{children}</div>}
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,80 L0,80 Z" fill="#F8F8FA" />
        </svg>
      </div>
    </section>
  )
}
