import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Download, Plus, LayoutDashboard, Search, Edit3, Trash2, ChevronLeft, ChevronRight, X, Image, AlertTriangle, Info, CheckCircle, FileText, MapPin, Fuel, DollarSign, Users as UsersIcon, Truck, Route, RotateCcw } from "lucide-react";
import api from "../api";
import DeleteModal from "../components/DeleteModal";
import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import StatCard from "../components/ui/StatCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import EmptyState from "../components/ui/EmptyState";
import { MONTHS, PER_PAGE } from "../utils/constants";
import { formatRupiah, formatDate, formatNumber } from "../utils/format";

export default function PerjalananIndex() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  // Export
  const [exportBulan, setExportBulan] = useState(new Date().getMonth() + 1);
  const [exportTahun, setExportTahun] = useState(new Date().getFullYear());

  // Filter & Search
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debounceTimer = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, perPage: PER_PAGE, bulan: filterBulan, tahun: filterTahun };
      if (searchQuery) params.search = searchQuery;
      const res = await api.get("/perjalanan", { params });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, filterBulan, filterTahun, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [filterBulan, filterTahun, searchQuery]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
    }, 400);
  };

  const handleResetFilter = () => {
    setFilterBulan(new Date().getMonth() + 1);
    setFilterTahun(new Date().getFullYear());
    setSearchInput("");
    setSearchQuery("");
  };

  const hasActiveFilter = () => {
    return filterBulan !== new Date().getMonth() + 1 ||
      filterTahun !== new Date().getFullYear() ||
      searchQuery !== "";
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/perjalanan/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch {
      //
    }
  };

  const handleExport = () => {
    const base = api.defaults.baseURL || "http://localhost:5000/api";
    window.open(`${base}/perjalanan/export/excel?bulan=${exportBulan}&tahun=${exportTahun}`, "_blank");
  };

  // Stats from page data
  const totalPerjalanan = meta?.total || 0;
  const totalBiaya = data.reduce((s, d) => s + (d.bbm?.jumlah_biaya || 0), 0);
  const perluVerifikasi = data.filter((d) => d.status_validasi === "Perlu Verifikasi").length;
  const anomaliCount = data.filter((d) => d.status_validasi === "Anomali").length;

  // Per-pegawai aggregation from page data
  const pegawaiMap = {};
  data.forEach((d) => {
    const pid = d.pegawai?.id || "unknown";
    if (!pegawaiMap[pid]) {
      pegawaiMap[pid] = {
        id: pid,
        nama: d.pegawai?.nama || "Tidak Diketahui",
        trips: 0,
        anomalies: 0,
        totalJarak: 0,
        totalBiaya: 0,
        totalEfisiensi: 0,
      };
    }
    pegawaiMap[pid].trips += 1;
    if (d.monitoring?.status_efisiensi === "Anomali") pegawaiMap[pid].anomalies += 1;
    pegawaiMap[pid].totalJarak += d.odometer?.jarak_km || 0;
    pegawaiMap[pid].totalBiaya += d.bbm?.jumlah_biaya || 0;
    pegawaiMap[pid].totalEfisiensi += d.monitoring?.efisiensi || 0;
  });

  const pegawaiList = Object.values(pegawaiMap).map((p) => ({
    ...p,
    rataEfisiensi: p.trips > 0 ? p.totalEfisiensi / p.trips : 0,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Monitoring BBM"
        title="Data Perjalanan BBM"
        description="Pantau dan kelola seluruh perjalanan serta konsumsi BBM kendaraan operasional"
      >
        <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
          <Download size={16} className="text-white" />
          <select
            value={exportBulan}
            onChange={(e) => setExportBulan(Number(e.target.value))}
            className="bg-transparent text-white text-xs font-body border border-white/20 rounded-lg px-2 py-1.5 outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value} className="text-ta-ink">{m.label}</option>
            ))}
          </select>
          <select
            value={exportTahun}
            onChange={(e) => setExportTahun(Number(e.target.value))}
            className="bg-transparent text-white text-xs font-body border border-white/20 rounded-lg px-2 py-1.5 outline-none"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
              <option key={y} value={y} className="text-ta-ink">{y}</option>
            ))}
          </select>
          <button onClick={handleExport} className="bg-white text-ta-red text-xs font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer hover:bg-white/90 transition-colors">
            Export
          </button>
        </div>
        <Link
          to="/perjalanan/create"
          className="btn-hero-primary inline-flex items-center gap-2 no-underline shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Tambah
        </Link>
      </PageHeader>

      <div className="wrap -mt-8 relative z-20 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon={<LayoutDashboard size={20} />} label="Total Perjalanan" value={totalPerjalanan} color="text-ta-red" />
          <StatCard icon={<DollarSign size={20} />} label="Total Biaya BBM" value={`Rp${totalBiaya.toLocaleString("id-ID")}`} color="text-emerald-600" subtitle={`${data.reduce((s, d) => s + (d.bbm?.vol_liter || 0), 0).toFixed(1)} L`} />
          <StatCard icon={<AlertTriangle size={20} />} label="Perlu Verifikasi" value={perluVerifikasi} color="text-amber-600" />
          <StatCard icon={<Info size={20} />} label="Anomali" value={anomaliCount} color="text-red-600" />
        </div>

        {loading && <LoadingSkeleton rows={3} />}

        {/* Filter toolbar - always visible */}
        <div className="hidden lg:flex items-center gap-2.5 flex-wrap bg-white rounded-2xl shadow-sm border border-ta-border px-4 sm:px-6 py-3 mb-4">
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(Number(e.target.value))}
                className="text-xs font-body border border-ta-border rounded-lg px-3 py-2 outline-none bg-white text-ta-ink"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(Number(e.target.value))}
                className="text-xs font-body border border-ta-border rounded-lg px-3 py-2 outline-none bg-white text-ta-ink"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="relative flex-1 min-w-[200px] max-w-[320px]">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ta-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari pegawai, tujuan, kendaraan, no pol, no bon..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full text-xs font-body border border-ta-border rounded-lg pl-8 pr-3 py-2 outline-none bg-white text-ta-ink placeholder:text-ta-muted/60"
                />
              </div>
              {hasActiveFilter() && (
                <button
                  onClick={handleResetFilter}
                  className="flex items-center gap-1.5 text-xs font-semibold font-body text-ta-muted bg-white border border-ta-border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors shrink-0"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
              {meta && (
                <span className="text-xs text-ta-muted font-body ml-auto">
                  {data.length > 0 ? `Menampilkan ${data.length} dari ${meta.total} data` : `${meta.total} data ditemukan`}
                </span>
              )}
            </div>

        {/* Mobile filter */}
        <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-ta-border p-3 mb-3 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(Number(e.target.value))}
                  className="text-xs font-body border border-ta-border rounded-lg px-2.5 py-1.5 outline-none bg-white text-ta-ink flex-1"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label.substring(0, 3)}</option>
                  ))}
                </select>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(Number(e.target.value))}
                  className="text-xs font-body border border-ta-border rounded-lg px-2.5 py-1.5 outline-none bg-white text-ta-ink flex-1"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                {hasActiveFilter() && (
                  <button
                    onClick={handleResetFilter}
                    className="flex items-center justify-center text-ta-muted bg-white border border-ta-border rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ta-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari pegawai, tujuan, kendaraan, no pol, no bon..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full text-xs font-body border border-ta-border rounded-lg pl-8 pr-3 py-1.5 outline-none bg-white text-ta-ink placeholder:text-ta-muted/60"
                />
              </div>
              {meta && (
                <p className="text-[11px] text-ta-muted font-body m-0 text-right">
                  {data.length > 0 ? `${data.length}/${meta.total}` : `${meta.total} data`}
                </p>
              )}
        </div>

        {!loading && data.length === 0 && (
          <EmptyState
            icon={<LayoutDashboard size={28} className="text-ta-red" />}
            title={hasActiveFilter() ? "Tidak Ada Hasil" : "Belum Ada Perjalanan"}
            description={hasActiveFilter() ? "Tidak ada data perjalanan yang cocok dengan filter yang dipilih. Coba ubah bulan, tahun, atau kata kunci pencarian." : "Belum ada data perjalanan yang tersimpan."}
            actionLabel={hasActiveFilter() ? "Reset Filter" : "Tambah Perjalanan"}
            actionTo={hasActiveFilter() ? undefined : "/perjalanan/create"}
            onAction={hasActiveFilter() ? handleResetFilter : undefined}
          />
        )}

        {/* Content */}
        {!loading && data.length > 0 && (
          <>
            {/* Rekap Per Pegawai */}
            {pegawaiList.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-ta-border overflow-hidden mb-6">
                <div className="px-4 sm:px-6 py-4 border-b border-ta-border bg-gray-50/50">
                  <h3 className="font-display font-bold text-ta-ink text-base m-0">Rekap Per Pegawai</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-ta-border">
                        <th className="text-left font-semibold font-body text-ta-muted px-3 py-3">#</th>
                        <th className="text-left font-semibold font-body text-ta-muted px-3 py-3">Nama</th>
                        <th className="text-center font-semibold font-body text-ta-muted px-3 py-3">Total Trip</th>
                        <th className="text-center font-semibold font-body text-ta-muted px-3 py-3">Anomali</th>
                        <th className="text-right font-semibold font-body text-ta-muted px-3 py-3">Total Jarak</th>
                        <th className="text-right font-semibold font-body text-ta-muted px-3 py-3">Total Biaya BBM</th>
                        <th className="text-right font-semibold font-body text-ta-muted px-3 py-3">Rata Efisiensi</th>
                        <th className="text-center font-semibold font-body text-ta-muted px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pegawaiList.map((p, idx) => (
                        <tr key={p.id} className="border-b border-ta-border hover:bg-gray-50/50">
                          <td className="px-3 py-3 text-ta-muted font-body">{idx + 1}</td>
                          <td className="px-3 py-3 font-semibold font-body text-ta-ink">{p.nama}</td>
                          <td className="px-3 py-3 text-center font-body text-ta-muted">{p.trips}</td>
                          <td className="px-3 py-3 text-center font-body">
                            <span className={`text-xs font-semibold ${p.anomalies > 0 ? "text-ta-red" : "text-emerald-600"}`}>
                              {p.anomalies}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right font-body text-ta-muted">{p.totalJarak.toFixed(1)} km</td>
                          <td className="px-3 py-3 text-right font-body text-ta-muted">Rp{p.totalBiaya.toLocaleString("id-ID")}</td>
                          <td className="px-3 py-3 text-right font-body text-ta-muted">{p.rataEfisiensi.toFixed(2)} km/L</td>
                          <td className="px-3 py-3 text-center">
                            <Badge status={p.anomalies > 0 ? "Anomali" : p.rataEfisiensi < 8 ? "Boros" : "Balance"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detail Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-ta-border overflow-hidden mb-6">
              <div className="px-4 sm:px-6 py-4 border-b border-ta-border bg-gray-50/50">
                <h3 className="font-display font-bold text-ta-ink text-base m-0">Detail Perjalanan</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100 border-b border-ta-border">
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">#</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Tanggal</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Pegawai</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Tujuan</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Kendaraan</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">No Pol</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5 border-l border-ta-border" colSpan="3">Odometer</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5 border-l border-ta-border" colSpan="3">Bon BBM</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Foto</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Efisiensi</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Status</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Validasi</th>
                      <th className="text-center font-bold font-body text-ta-muted px-2 py-2.5" rowSpan="2">Aksi</th>
                    </tr>
                    <tr className="bg-gray-50 border-b border-ta-border">
                      <th className="text-center font-semibold font-body text-ta-muted px-2 py-2 border-l border-ta-border">KM Lama</th>
                      <th className="text-center font-semibold font-body text-ta-muted px-2 py-2">KM Baru</th>
                      <th className="text-center font-semibold font-body text-ta-muted px-2 py-2">Jarak</th>
                      <th className="text-center font-semibold font-body text-ta-muted px-2 py-2 border-l border-ta-border">No Bon</th>
                      <th className="text-center font-semibold font-body text-ta-muted px-2 py-2">Harga/L</th>
                      <th className="text-center font-semibold font-body text-ta-muted px-2 py-2">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, idx) => {
                      const rowBg = d.status_validasi === "Anomali"
                        ? "bg-red-50/80"
                        : d.status_validasi === "Perlu Verifikasi"
                        ? "bg-amber-50/80"
                        : "";
                      return (
                        <tr key={d.id} className={`border-b border-ta-border hover:bg-gray-50/50 transition-colors ${rowBg}`}>
                          <td className="px-2 py-3 text-center font-body text-ta-muted">{(page - 1) * PER_PAGE + idx + 1}</td>
                          <td className="px-2 py-3 text-center font-body text-ta-muted whitespace-nowrap">{d.tanggal}</td>
                          <td className="px-2 py-3 font-body text-ta-ink">{d.pegawai?.nama || "-"}</td>
                          <td className="px-2 py-3 font-body text-ta-muted max-w-[100px] truncate" title={d.tujuan}>{d.tujuan}</td>
                          <td className="px-2 py-3 font-body text-ta-ink">{d.kendaraan?.jenis || "-"}</td>
                          <td className="px-2 py-3 font-semibold font-body text-ta-ink whitespace-nowrap">{d.kendaraan?.plat_nomor || "-"}</td>
                          <td className="px-2 py-3 text-right font-body tabular-nums text-ta-muted border-l border-ta-border">{d.odometer?.km_lama?.toFixed(0)}</td>
                          <td className="px-2 py-3 text-right font-body tabular-nums text-ta-muted">{d.odometer?.km_baru?.toFixed(0)}</td>
                          <td className="px-2 py-3 text-right font-body tabular-nums font-semibold text-ta-ink">{d.odometer?.jarak_km?.toFixed(1)}</td>
                          <td className="px-2 py-3 text-center font-body text-ta-muted border-l border-ta-border">{d.bbm?.no_bon || "-"}</td>
                          <td className="px-2 py-3 text-right font-body tabular-nums text-ta-muted">Rp{d.bbm?.harga_per_liter?.toLocaleString("id-ID")}</td>
                          <td className="px-2 py-3 text-right font-body tabular-nums font-semibold text-ta-ink">Rp{d.bbm?.jumlah_biaya?.toLocaleString("id-ID")}</td>
                          <td className="px-2 py-3 text-center">
                            <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center mx-auto text-ta-muted">
                              <Image size={14} />
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right font-body tabular-nums text-ta-muted">{d.monitoring?.efisiensi?.toFixed(2)}</td>
                          <td className="px-2 py-3 text-center">
                            <Badge status={d.monitoring?.status_efisiensi} />
                          </td>
                          <td className="px-2 py-3 text-center">
                            <button
                              onClick={() => setDetailTarget(d)}
                              className="text-xs text-ta-red font-semibold font-body bg-ta-soft px-2.5 py-1 rounded-full border-none cursor-pointer hover:bg-red-200 transition-colors"
                            >
                              Detail
                            </button>
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Link
                                to={`/perjalanan/edit/${d.id}`}
                                className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={13} />
                              </Link>
                              <button
                                onClick={() => setDeleteTarget(d)}
                                className="p-1.5 rounded-lg bg-red-50 text-ta-red hover:bg-red-100 transition-colors cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-3 mb-6">
              {data.map((d) => {
                const cardBorder = d.status_validasi === "Anomali"
                  ? "border-l-4 border-l-red-500"
                  : d.status_validasi === "Perlu Verifikasi"
                  ? "border-l-4 border-l-amber-500"
                  : "";
                return (
                  <div key={d.id} className={`bg-white rounded-2xl shadow-sm border border-ta-border p-4 ${cardBorder}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-display font-bold text-ta-ink text-sm m-0">{d.pegawai?.nama || "-"}</p>
                        <p className="text-xs text-ta-muted font-body m-0">{d.tanggal} &middot; {d.kendaraan?.plat_nomor || "-"}</p>
                      </div>
                      <Badge status={d.monitoring?.status_efisiensi} />
                    </div>
                    <div className="text-xs text-ta-muted font-body mb-2">
                      <span>Tujuan: {d.tujuan}</span>
                      <br />
                      <span>KM: {d.odometer?.km_lama?.toFixed(0)} &rarr; {d.odometer?.km_baru?.toFixed(0)} ({d.odometer?.jarak_km?.toFixed(1)} km)</span>
                      <br />
                      <span>BBM: Rp{d.bbm?.jumlah_biaya?.toLocaleString("id-ID")} ({d.bbm?.vol_liter?.toFixed(1)} L)</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-ta-border">
                      <button
                        onClick={() => setDetailTarget(d)}
                        className="text-xs text-ta-red font-semibold font-body bg-ta-soft px-3 py-1.5 rounded-full border-none cursor-pointer hover:bg-red-200 transition-colors"
                      >
                        Detail Validasi
                      </button>
                      <div className="flex gap-1.5">
                        <Link
                          to={`/perjalanan/edit/${d.id}`}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        >
                          <Edit3 size={13} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(d)}
                          className="p-1.5 rounded-lg bg-red-50 text-ta-red hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination page={page} lastPage={meta?.lastPage} total={meta?.total} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* FAB for mobile */}
      <Link
        to="/perjalanan/create"
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full hero-bg text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow no-underline"
      >
        <Plus size={24} strokeWidth={2.5} />
      </Link>

      {/* Detail Modal */}
      <DetailModal data={detailTarget} onClose={() => setDetailTarget(null)} />

      {/* Delete Modal */}
      <DeleteModal
        show={!!deleteTarget}
        itemType="Perjalanan"
        itemName={deleteTarget ? `${deleteTarget.pegawai?.nama || ""} - ${deleteTarget.tanggal || ""}` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-ta-muted font-semibold font-body m-0 mb-0.5">{label}</p>
      <p className="text-sm font-body text-ta-ink font-medium m-0 break-words">{value}</p>
    </div>
  );
}

function DetailModal({ data, onClose }) {
  useEffect(() => {
    if (data) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [data]);

  if (!data) return null;

  const flags = data.monitoring?.fraud_flags || {};
  const displayFlags = flags.display_flags || [];

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-ta-ink text-lg m-0">Detail Validasi</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-ta-muted hover:bg-gray-200 transition-colors border-none cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <InfoItem label="Tanggal" value={data.tanggal || "-"} />
          <InfoItem label="Pegawai" value={data.pegawai?.nama || "-"} />
          <InfoItem label="No Polisi" value={data.kendaraan?.plat_nomor || "-"} />
          <InfoItem label="Tujuan" value={data.tujuan || "-"} />
          <div className="col-span-2">
            <InfoItem label="Uraian" value={data.uraian || "-"} />
          </div>
          <InfoItem label="KM Lama" value={data.odometer?.km_lama?.toFixed(0) || "-"} />
          <InfoItem label="KM Baru" value={data.odometer?.km_baru?.toFixed(0) || "-"} />
          <InfoItem label="Jarak" value={`${(data.odometer?.jarak_km || 0).toFixed(1)} km`} />
          <InfoItem label="Volume" value={`${(data.bbm?.vol_liter || 0).toFixed(2)} L`} />
          <InfoItem label="Efisiensi" value={`${(data.monitoring?.efisiensi || 0).toFixed(2)} km/L`} />
          <InfoItem label="Nilai Sewajarnya" value={`${(data.nilai_sewajarnya || 0).toFixed(2)} km/L`} />
          <InfoItem label="Deviasi" value={`${(data.deviasi_km || 0).toFixed(2)} km/L`} />
          <InfoItem label="Timeline" value={data.timeline_status || "-"} />
        </div>

        <div className="mt-4 pt-4 border-t border-ta-border">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm font-semibold font-body text-ta-ink m-0">Status Validasi:</p>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-body ${
              data.status_validasi === "Anomali"
                ? "bg-red-50 text-red-700"
                : data.status_validasi === "Perlu Verifikasi"
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}>
              {data.status_validasi || "Normal"}
            </span>
          </div>
          <p className="text-xs text-ta-muted font-body m-0 mb-2">{data.keterangan_validasi || "Tidak ada alasan."}</p>
        </div>

        {displayFlags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-ta-border">
            <p className="text-sm font-semibold font-body text-ta-ink m-0 mb-2">Indikasi:</p>
            <div className="flex flex-wrap gap-2">
              {displayFlags.map((f, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold font-body ${
                  f.type === "danger"
                    ? "bg-red-50 text-red-700"
                    : f.type === "warning"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
                }`}>
                  {f.text || f}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.alasan_timeline && (
          <div className="mt-4 pt-4 border-t border-ta-border">
            <p className="text-sm font-semibold font-body text-ta-muted m-0">Alasan Timeline: {data.alasan_timeline}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-sm px-6 py-2">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
