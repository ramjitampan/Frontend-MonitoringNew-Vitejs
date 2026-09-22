import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const linkClass = ({ isActive }) => `nav-link-item${isActive ? " active" : ""}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : "bg-white/80"}`}>
        <div className="wrap">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-4 no-underline">
              <img src="/foto/Image2.png" alt="Logo" className="w-auto h-7 sm:h-9" />
              <div className="hidden sm:block">
                <p className="text-xs font-body text-ta-muted leading-tight m-0">PT. Telkom Akses Binjai</p>
                <p className="text-sm font-display font-bold text-ta-ink leading-tight m-0">Monitoring BBM</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>
                Beranda
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/pegawai" className={linkClass}>
                    Data Pegawai
                  </NavLink>
                  <NavLink to="/kendaraan" className={linkClass}>
                    Data Kendaraan
                  </NavLink>
                  <NavLink to="/perjalanan" className={linkClass}>
                    Data Perjalanan
                  </NavLink>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/perjalanan" className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold font-body no-underline hero-bg hover:shadow-lg transition-shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    Dashboard
                  </Link>

                  <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-ta-red text-ta-red text-sm font-semibold font-body bg-transparent hover:bg-ta-soft transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Keluar
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-ta-red text-white text-sm font-semibold font-body no-underline hover:bg-ta-dark transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Masuk
                </Link>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-none" aria-label="Toggle menu">
                <span className={`block w-6 h-0.5 bg-ta-ink transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block w-6 h-0.5 bg-ta-ink transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-0.5 bg-ta-ink transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-ta-border shadow-lg animate-fade-up">
            <div className="px-4 py-4 flex flex-col gap-2">
              <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
                Beranda
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/pegawai" className={linkClass} onClick={() => setMenuOpen(false)}>
                    Data Pegawai
                  </NavLink>
                  <NavLink to="/kendaraan" className={linkClass} onClick={() => setMenuOpen(false)}>
                    Data Kendaraan
                  </NavLink>
                  <NavLink to="/perjalanan" className={linkClass} onClick={() => setMenuOpen(false)}>
                    Data Perjalanan
                  </NavLink>
                  <Link to="/perjalanan" className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold font-body no-underline hero-bg" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── MAIN ── */}
      <main className="flex-1 pt-14">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="hero-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-6">
          {/* Grid utama: 3 kolom di desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pb-10 border-b border-white/10">
            {/* Kolom 1 — Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img src="/foto/image.png" alt="Logo" className="h-10 w-auto shrink-0" />
                <div>
                  <p className="text-sm font-display font-bold text-white leading-snug m-0">PT. Telkom Akses Binjai</p>
                  <p className="text-[0.7rem] text-white/50 font-body m-0">Monitoring BBM</p>
                </div>
              </div>

              <p className="text-[0.82rem] text-white/55 font-body leading-relaxed m-0">Sistem internal untuk memantau dan mengevaluasi penggunaan BBM kendaraan operasional secara efisien dan terukur.</p>

              <div className="flex gap-2">
                {[
                  { label: "Facebook", filled: true, d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                  { label: "Instagram", filled: false, d: null },
                  { label: "LinkedIn", filled: true, d: null },
                ].map(({ label }) => (
                  <a key={label} href="#" aria-label={label} className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/55 hover:bg-white/20 hover:text-white transition-all shrink-0">
                    {label === "Facebook" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    )}
                    {label === "Instagram" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    )}
                    {label === "LinkedIn" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Kolom 2 — Navigasi + Perusahaan (side by side) */}
            <div className="grid grid-cols-2 gap-8">
              {/* Navigasi */}
              <div>
                <p className="text-[0.65rem] font-bold text-white/35 uppercase tracking-widest mb-4">Navigasi</p>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {[
                    { to: "/", label: "Beranda" },
                    { to: "/pegawai", label: "Data Pegawai" },
                    { to: "/kendaraan", label: "Data Kendaraan" },
                    { to: "/perjalanan", label: "Data Perjalanan" },
                  ].map(({ to, label }) => (
                    <li key={label}>
                      <Link to={to} className="text-[0.82rem] text-white/60 font-body no-underline hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Perusahaan */}
              <div>
                <p className="text-[0.65rem] font-bold text-white/35 uppercase tracking-widest mb-4">Perusahaan</p>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {["PT. Telkom Akses", "Cabang Binjai", "Unit Operasional", "Monitoring BBM"].map((item) => (
                    <li key={item} className="text-[0.82rem] text-white/60 font-body">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kolom 3 — Lokasi */}
            <div>
              <p className="text-[0.65rem] font-bold text-white/35 uppercase tracking-widest mb-4">Lokasi Kantor</p>

              {/* Map — tinggi fixed, tidak akan meluber */}
              <div className="rounded-xl overflow-hidden border border-white/15" style={{ height: 140 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.9006158761663!2d98.49255427502074!3d3.6102107963639045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303129edc060822f%3A0x439102aee047a3cf!2sTelkom%20Indonesia%20Cabang%20Binjai%20-%20Unit%20Perbaikan%20%26%20Plasa%20Telkom!5e0!3m2!1sid!2sid!4v1784708134535!5m2!1sid!2sid"
                  width="100%"
                  height="140"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Kantor"
                />
              </div>

              {/* Alamat di bawah map */}
              <div className="flex items-start gap-2 mt-3">
                <svg className="shrink-0 mt-0.5 text-white/40" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-[0.78rem] text-white/50 font-body leading-relaxed m-0">
                  Telkom Indonesia Cabang Binjai,
                  <br />
                  Jl. Sudirman, Binjai, Sumatera Utara
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[0.72rem] text-white/35 font-body m-0">&copy; {new Date().getFullYear()} PT. Telkom Akses Binjai. All rights reserved.</p>
            <p className="text-[0.72rem] text-white/35 font-body m-0">
              Developed by <span className="text-white/60 font-semibold">Ramzy Junfaris Hamonangan</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
