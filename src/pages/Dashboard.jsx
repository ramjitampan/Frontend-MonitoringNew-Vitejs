import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, Play, TrendingUp, Users, Truck, MapPin, Fuel, Receipt, PieChart, FileDown, Settings, Search, Gauge, Globe, Server, Smartphone, Building2, GraduationCap, Laptop, ArrowRight, Shield, RefreshCw } from "lucide-react";
import api from "../api";
import StatCard from "../components/ui/StatCard";
import FeatureCard from "../components/ui/FeatureCard";
import { formatRupiahSingkat } from "../utils/format";

function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    check: Check, play: Play, chartLine: TrendingUp, users: Users, truck: Truck,
    route: MapPin, fuel: Fuel, receipt: Receipt, pie: PieChart, fileImport: FileDown,
    gears: Settings, scan: Search, gauge: Gauge, globe: Globe, server: Server,
    phone: Smartphone, building: Building2, grad: GraduationCap, laptop: Laptop,
    arrowRight: ArrowRight, shield: Shield, refresh: RefreshCw,
  };
  const Comp = icons[name];
  if (!Comp) return null;
  const size = parseInt(className.match(/(\d+)/)?.[0] || "20");
  return <Comp size={size} className={className} aria-hidden="true" />;
}

function AnimatedCounter({ target, isRupiah, variant = "dark" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            const duration = 1400;
            const startTime = performance.now();
            function tick(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * target));
              if (progress < 1) requestAnimationFrame(tick);
              else setCount(target);
            }
            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const colorClass = variant === "light" ? "text-white" : "text-ta-ink";

  return (
    <div ref={ref} className={"font-display font-extrabold text-[1.7rem] leading-tight " + colorClass}>
      {isRupiah ? formatRupiahSingkat(count) : count.toLocaleString("id-ID")}
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPegawai: 0,
    totalKendaraan: 0,
    totalPerjalanan: 0,
    totalBBM: 0,
  });

  useEffect(() => {
    let active = true;
    const load = () => {
      api
        .get("/dashboard")
        .then((res) => {
          if (!active) return;
          const d = res.data?.data ?? {};
          setStats({
            totalPegawai: d.totalPegawai ?? 0,
            totalKendaraan: d.totalKendaraan ?? 0,
            totalPerjalanan: d.totalPerjalanan ?? 0,
            totalBBM: d.totalBBM ?? 0,
          });
        })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useReveal();

  const statItems = [
    { icon: "users", label: "Total Pegawai", value: stats.totalPegawai, isRupiah: false, color: "from-blue-500 to-blue-600" },
    { icon: "truck", label: "Total Kendaraan", value: stats.totalKendaraan, isRupiah: false, color: "from-emerald-500 to-emerald-600" },
    { icon: "route", label: "Total Perjalanan", value: stats.totalPerjalanan, isRupiah: false, color: "from-violet-500 to-violet-600" },
    { icon: "fuel", label: "Pengeluaran BBM", value: stats.totalBBM, isRupiah: true, color: "from-amber-500 to-amber-600" },
  ];

  const fitur = [
    { icon: "users", title: "Data Pegawai", desc: "Kelola data pengemudi dan pegawai yang bertanggung jawab atas kendaraan operasional." },
    { icon: "truck", title: "Data Kendaraan", desc: "Catat identitas, jenis, dan status seluruh kendaraan operasional perusahaan." },
    { icon: "route", title: "Data Perjalanan", desc: "Rekam setiap perjalanan dinas lengkap dengan rute, jarak, dan tujuan." },
    { icon: "fuel", title: "Monitoring BBM", desc: "Pantau konsumsi BBM setiap kendaraan secara berkala dan akurat." },
    { icon: "receipt", title: "Upload Bon", desc: "Unggah bukti pembelian BBM sebagai dasar verifikasi dan pelaporan." },
    { icon: "pie", title: "Laporan & Rekap", desc: "Hasilkan laporan dan rekap penggunaan BBM untuk evaluasi manajemen." },
  ];

  const steps = [
    { num: 1, icon: "fileImport", title: "Input Data", desc: "Pegawai, kendaraan & perjalanan dicatat ke sistem." },
    { num: 2, icon: "gears", title: "Analisis Otomatis", desc: "Sistem menghitung konsumsi & rekap BBM otomatis." },
    { num: 3, icon: "scan", title: "Monitoring", desc: "Penggunaan BBM dipantau secara berkala." },
    { num: 4, icon: "gauge", title: "Dashboard", desc: "Hasil tersaji dalam dashboard yang mudah dibaca." },
  ];

  const integrasiPoints = [
    "Data pegawai, kendaraan, dan perjalanan tersimpan terpusat di satu basis data.",
    "API Laravel menghubungkan website dengan aplikasi mobile secara real-time.",
    "Arsitektur siap dikembangkan menjadi aplikasi Android tanpa mengubah sistem inti.",
  ];

  const badges = [
    { icon: "building", label: "PT. Telkom Akses Binjai" },
    { icon: "grad", label: "Universitas Negeri Padang" },
    { icon: "laptop", label: "Teknik Informatika" },
  ];

  const miniStats = [
    { value: "2026", label: "Tahun Magang" },
    { value: "S1", label: "Jenjang Studi" },
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(192,57,43,0.45); }
          70%  { box-shadow: 0 0 0 12px rgba(192,57,43,0); }
          100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: .10s; }
        .reveal-d2 { transition-delay: .20s; }
        .reveal-d3 { transition-delay: .30s; }
        .badge-pill-hover { transition: background .2s, transform .2s; }
        .badge-pill-hover:hover { background: rgba(255,255,255,0.22) !important; transform: translateX(5px); }
        .node-icon-hover { transition: transform .3s ease; }
        .node-icon-hover:hover { transform: scale(1.08) translateY(-4px); }
        .api-core { animation: pulse-ring 2.5s ease-out infinite; }
        .shimmer-bar { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent); }
      `}</style>

      {/* HERO */}
      <header className="hero-bg relative text-white pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.05] -top-48 -right-36 pointer-events-none"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/[0.04] top-20 -left-20 pointer-events-none"></div>

        <div className="wrap relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <span className="inline-flex items-center gap-2 bg-white/[0.13] border border-white/[0.24] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <Icon name="check" className="w-3.5 h-3.5" /> Sistem Internal PT. Telkom Akses Binjai
              </span>
              <h1 className="font-display font-extrabold text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-[1.15] mb-4">Sistem Monitoring BBM Kendaraan Operasional</h1>
              <p className="text-[1.06rem] text-white/85 mb-8 leading-relaxed max-w-xl">Membantu PT. Telkom Akses Binjai mengelola, memonitor, dan mengevaluasi penggunaan BBM kendaraan operasional secara efektif dan terukur.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/perjalanan/create" className="btn-hero-primary bg-white text-ta-dark font-bold rounded-full px-7 py-3.5 border-2 border-white inline-flex items-center gap-2 no-underline">
                  <Icon name="play" className="w-3.5 h-3.5" /> Mulai Monitoring
                </Link>
                <Link to="/perjalanan" className="btn-hero-outline text-white font-bold rounded-full px-7 py-3.5 border-2 border-white/60 inline-flex items-center gap-2 no-underline">
                  <Icon name="chartLine" className="w-3.5 h-3.5" /> Lihat Data
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center reveal reveal-d2">
              <div className="grid grid-cols-2 gap-4">
                {statItems.map((item) => (
                  <div key={item.label} className="bg-white/[0.1] border border-white/[0.15] rounded-2xl p-5 backdrop-blur-sm text-center">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.15] flex items-center justify-center mx-auto mb-3">
                      <Icon name={item.icon} className="w-5 h-5 text-white" />
                    </div>
                    <AnimatedCounter target={item.value} isRupiah={item.isRupiah} variant="light" />
                    <div className="text-white/70 text-[0.75rem] font-medium mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,40 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </header>

      {/* STATS BAR (mobile) */}
      <div className="lg:hidden -mt-12 relative z-20 px-4 sm:px-6">
        <div className="wrap !px-4 grid grid-cols-2 gap-3">
          {statItems.map((item) => (
            <div key={item.label} className="bg-white border border-ta-border rounded-2xl p-4 shadow-lg reveal">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-ta-soft text-ta-red flex items-center justify-center">
                  <Icon name={item.icon} className="w-4 h-4" />
                </div>
                <div>
                  <AnimatedCounter target={item.value} isRupiah={item.isRupiah} variant="dark" />
                  <div className="text-ta-muted text-[0.7rem] font-medium">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FITUR SISTEM */}
      <section className="py-16 lg:py-20" id="fitur">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow justify-center mb-3 block reveal">Fitur Sistem</span>
            <h2 className="font-display font-bold text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] mb-3 text-ta-ink reveal reveal-d1">Semua Kebutuhan Monitoring dalam Satu Sistem</h2>
            <p className="text-ta-muted text-[1.01rem] reveal reveal-d2">Dirancang khusus untuk mendukung operasional PT. Telkom Akses Binjai secara menyeluruh, dari pencatatan data hingga pelaporan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fitur.map((f, i) => (
              <div key={f.title} className="feature-card bg-white rounded-2xl border border-ta-border p-7 hover:shadow-xl reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="feature-icon w-12 h-12 rounded-2xl bg-ta-soft text-ta-red flex items-center justify-center mb-5">
                  <Icon name={f.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-[1.05rem] mb-2 text-ta-ink">{f.title}</h3>
                <p className="text-ta-muted text-[0.9rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALUR SISTEM */}
      <section className="py-16 lg:py-20 bg-ta-bg" id="alur">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow justify-center mb-3 block reveal">Alur Sistem</span>
            <h2 className="font-display font-bold text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] mb-3 text-ta-ink reveal reveal-d1">Bagaimana Sistem Ini Bekerja</h2>
            <p className="text-ta-muted text-[1.01rem] reveal reveal-d2">Proses sederhana dari input data hingga tersaji dalam dashboard yang siap dianalisis.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-ta-red/30 via-ta-red to-ta-red/30 rounded-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
              {steps.map((step, i) => (
                <div key={step.num} className="flow-step relative bg-white rounded-2xl border border-ta-border p-6 text-center hover:shadow-lg transition-shadow reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ta-red to-ta-dark text-white font-display font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-lg shadow-ta-red/20">{step.num}</div>
                  <div className="text-ta-red flex justify-center mb-3">
                    <Icon name={step.icon} className="w-6 h-6" />
                  </div>
                  <div className="font-display font-bold text-[0.96rem] mb-1 text-ta-ink">{step.title}</div>
                  <p className="text-ta-muted text-[0.83rem] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRASI API */}
      <section className="py-16 lg:py-20" id="integrasi">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow mb-4 block reveal">Integrasi API</span>
              <h2 className="font-display font-bold text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] mb-5 text-ta-ink reveal reveal-d1">Satu Data, Siap untuk Web &amp; Mobile</h2>
              <p className="text-ta-muted text-[1.01rem] mb-7 leading-relaxed reveal reveal-d2">
                Website dan aplikasi mobile dapat menggunakan data yang sama melalui API Laravel, sehingga sistem ini siap dikembangkan menjadi aplikasi Android di masa depan tanpa perlu membangun ulang dari awal.
              </p>
              <ul className="space-y-4 reveal reveal-d3">
                {integrasiPoints.map((txt) => (
                  <li key={txt} className="flex items-start gap-3">
                    <Icon name="check" className="w-4 h-4 text-ta-red mt-0.5 shrink-0" />
                    <span className="text-ta-ink text-[0.94rem]">{txt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative bg-white border border-ta-border rounded-2xl p-8 pt-10 overflow-hidden reveal reveal-d1 shadow-lg">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(#D1D5DB 1px,transparent 1px)", backgroundSize: "16px 16px", opacity: 0.4 }} />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-3">
                <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                  <div className="node-icon-hover w-14 h-14 rounded-2xl bg-ta-soft text-ta-red flex items-center justify-center">
                    <Icon name="globe" className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-ta-ink">Website</span>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="relative overflow-hidden rotate-90 sm:rotate-0" style={{ width: 48, height: 2, background: "linear-gradient(90deg,#e5e7eb,#c0392b)", borderRadius: 2 }}>
                    <div className="shimmer-bar" style={{ animation: "shimmer 1.8s infinite" }} />
                  </div>
                  <Icon name="arrowRight" className="w-4 h-4 text-ta-red rotate-90 sm:rotate-0 opacity-60" />
                </div>
                <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-[0.6rem] font-bold tracking-wide px-2 py-0.5 rounded-full" style={{ background: "#c0392b" }}>
                      CORE
                    </span>
                    <div className="node-icon-hover api-core mt-2 w-14 h-14 rounded-2xl bg-ta-red text-white flex items-center justify-center">
                      <Icon name="server" className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-ta-ink">Laravel API</span>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="relative overflow-hidden rotate-90 sm:rotate-0" style={{ width: 48, height: 2, background: "linear-gradient(90deg,#e5e7eb,#c0392b)", borderRadius: 2 }}>
                    <div className="shimmer-bar" style={{ animation: "shimmer 1.8s infinite", animationDelay: "0.6s" }} />
                  </div>
                  <Icon name="arrowRight" className="w-4 h-4 text-ta-red rotate-90 sm:rotate-0 opacity-60" />
                </div>
                <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                  <div className="node-icon-hover w-14 h-14 rounded-2xl bg-ta-soft text-ta-red flex items-center justify-center">
                    <Icon name="phone" className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-ta-ink">Mobile App</span>
                </div>
              </div>
              <div className="relative mt-6 flex flex-wrap gap-2 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#f0faf4", border: "1px solid #b2dfc6", color: "#1a7a45" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "dot-blink 1.5s infinite" }} />
                  API Active
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#fdecea", border: "1px solid #f0b4ae", color: "#8e1a13" }}>
                  <Icon name="shield" className="w-3 h-3" />
                  Laravel Auth
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#eef3ff", border: "1px solid #bfcfff", color: "#2d4fcf" }}>
                  <span style={{ display: "inline-block", animation: "spin 2s linear infinite" }}>
                    <Icon name="refresh" className="w-3 h-3" />
                  </span>
                  Real-time
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG PROYEK */}
      <section className="py-16 lg:py-20 bg-ta-bg" id="tentang">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="eyebrow mb-4 block reveal">Tentang Proyek</span>
              <h2 className="font-display font-bold text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] mb-5 text-ta-ink reveal reveal-d1">Hasil Karya Mahasiswa Magang</h2>
              <p className="text-ta-muted text-[1.01rem] leading-relaxed reveal reveal-d2">
                Sistem ini dikembangkan sebagai proyek magang mahasiswa Informatika Universitas Negeri Padang di PT. Telkom Akses Binjai, untuk membantu proses monitoring penggunaan BBM kendaraan operasional agar lebih tertib, transparan,
                dan mudah dievaluasi oleh manajemen.
              </p>
            </div>

            <div className="order-1 lg:order-2 reveal reveal-d1">
              <div className="rounded-2xl p-8 text-white relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #c0392b 0%, #8e1a13 100%)" }}>
                <div className="absolute w-56 h-56 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)", bottom: -80, right: -50 }} />
                <div className="absolute w-36 h-36 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)", top: -40, left: -30 }} />

                <h5 className="font-display font-bold text-lg mb-5 relative z-10 flex items-center gap-2">
                  <Icon name="grad" className="w-5 h-5" /> Proyek Magang 2026
                </h5>

                <div className="relative z-10 flex flex-col gap-2 mb-5">
                  {badges.map(({ icon, label }, i) => (
                    <div
                      key={label}
                      className={`badge-pill-hover flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium reveal reveal-d${i + 2}`}
                      style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff" }}
                    >
                      <Icon name={icon} className="w-4 h-4" />
                      {label}
                    </div>
                  ))}
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-3">
                  {miniStats.map(({ value, label }) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
                      <div className="font-display font-extrabold text-xl text-white">{value}</div>
                      <div className="text-[0.7rem] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
