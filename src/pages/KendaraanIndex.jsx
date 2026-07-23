import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import DeleteModal from "../components/DeleteModal";

const PER_PAGE = 10;

const jenisIcon = (jenis) => {
  switch (jenis) {
    case "Pickup":
    case "Pick Up":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="15" height="8" rx="1"/><rect x="10" y="10" width="8" height="6" rx="1"/><circle cx="6" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>
      );
    case "Truck":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="15" height="11" rx="1"/><rect x="10" y="9" width="10" height="6" rx="1"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/></svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><line x1="9" y1="6" x2="9" y2="10"/><line x1="15" y1="6" x2="15" y2="10"/></svg>
      );
  }
};

export default function KendaraanIndex() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, perPage: PER_PAGE };
      if (search) params.search = search;
      const res = await api.get("/kendaraan", { params });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/kendaraan/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch {
      //
    }
  };

  const totalKendaraan = meta?.total || 0;
  const r4Count = data.filter((k) => k.jenis === "R4").length;

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-bg px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20 relative overflow-hidden">
        <div className="wrap relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="eyebrow text-white/80">Manajemen Armada</p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white m-0">
                Data Kendaraan
              </h1>
              <p className="text-sm sm:text-base text-white/70 font-body mt-1 max-w-xl">
                Kelola data kendaraan operasional PT. Telkom Akses Binjai
              </p>
            </div>
            <Link
              to="/kendaraan/create"
              className="btn-hero-primary inline-flex items-center gap-2 no-underline shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Kendaraan
            </Link>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none"><path d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,80 L0,80 Z" fill="#F8F8FA"/></svg>
        </div>
      </section>

      <div className="wrap -mt-8 relative z-20 pb-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="stat-card bg-white rounded-2xl p-5 shadow-sm border border-ta-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ta-soft flex items-center justify-center text-ta-red shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><line x1="9" y1="6" x2="9" y2="10"/><line x1="15" y1="6" x2="15" y2="10"/></svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ta-muted font-body font-semibold m-0">Total Kendaraan</p>
                <p className="font-display font-bold text-2xl text-ta-ink m-0">{totalKendaraan}</p>
              </div>
            </div>
          </div>
          <div className="stat-card bg-white rounded-2xl p-5 shadow-sm border border-ta-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ta-soft flex items-center justify-center text-ta-red shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/></svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ta-muted font-body font-semibold m-0">Kendaraan R4</p>
                <p className="font-display font-bold text-2xl text-ta-ink m-0">{r4Count}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-ta-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 w-full relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Cari plat nomor, merk, atau jenis kendaraan..."
                className="search-ring pl-10"
                value={search}
                onChange={handleSearchInput}
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-ta-border">
                <div className="shimmer-bar w-3/4 mb-3" />
                <div className="shimmer-bar w-1/2 mb-2" />
                <div className="shimmer-bar w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && data.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-ta-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-ta-soft flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E2001A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><line x1="9" y1="6" x2="9" y2="10"/><line x1="15" y1="6" x2="15" y2="10"/></svg>
            </div>
            <h3 className="font-display font-bold text-lg text-ta-ink m-0 mb-1">Belum Ada Kendaraan</h3>
            <p className="text-sm text-ta-muted font-body m-0 mb-6">
              Belum ada data kendaraan yang tersimpan. Silakan tambah kendaraan baru.
            </p>
            <Link to="/kendaraan/create" className="btn-primary no-underline inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Kendaraan
            </Link>
          </div>
        )}

        {/* Desktop table */}
        {!loading && data.length > 0 && (
          <>
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-ta-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-ta-border">
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">#</th>
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">Kendaraan</th>
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">Plat Nomor</th>
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">Merk</th>
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">Tahun</th>
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">Jenis</th>
                      <th className="text-left font-semibold font-body text-ta-muted px-4 py-3.5">Status</th>
                      <th className="text-center font-semibold font-body text-ta-muted px-4 py-3.5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((k, idx) => (
                      <tr key={k.id} className="border-b border-ta-border hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 text-ta-muted font-body">{(page - 1) * PER_PAGE + idx + 1}</td>
                        <td className="px-4 py-3.5">
                          <div className="w-9 h-9 rounded-lg bg-ta-soft flex items-center justify-center text-ta-red">
                            {jenisIcon(k.jenis)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold font-body text-ta-ink">{k.platNomor}</td>
                        <td className="px-4 py-3.5 font-body text-ta-muted">{k.merk}</td>
                        <td className="px-4 py-3.5 font-body text-ta-muted">{k.tahun}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${
                            k.jenis === "R4"
                              ? "bg-blue-50 text-blue-700"
                              : k.jenis === "Pickup" || k.jenis === "Pick Up"
                              ? "bg-green-50 text-green-700"
                              : k.jenis === "Truck"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-gray-50 text-gray-700"
                          }`}>
                            {k.jenis}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-body bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Aktif
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/kendaraan/edit/${k.id}`}
                              className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(k)}
                              className="p-2 rounded-lg bg-red-50 text-ta-red hover:bg-red-100 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {data.map((k) => (
                <div key={k.id} className="bg-white rounded-2xl shadow-sm border border-ta-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ta-soft flex items-center justify-center text-ta-red shrink-0">
                      {jenisIcon(k.jenis)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-display font-bold text-ta-ink text-sm m-0 truncate">{k.platNomor}</p>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      </div>
                      <p className="text-xs text-ta-muted font-body m-0 truncate">{k.merk} &middot; {k.tahun}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-body ${
                          k.jenis === "R4"
                            ? "bg-blue-50 text-blue-700"
                            : k.jenis === "Pickup" || k.jenis === "Pick Up"
                            ? "bg-green-50 text-green-700"
                            : k.jenis === "Truck"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-gray-50 text-gray-700"
                        }`}>
                          {k.jenis}
                        </span>
                        <span className="text-[10px] text-ta-muted font-body">ID: {k.id}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Link
                        to={`/kendaraan/edit/${k.id}`}
                        className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(k)}
                        className="p-2 rounded-lg bg-red-50 text-ta-red hover:bg-red-100 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.lastPage > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-ta-muted font-body m-0">
                  Halaman {meta.currentPage} dari {meta.lastPage} ({meta.total} data)
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl border border-ta-border text-sm font-body font-semibold text-ta-muted bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={page >= meta.lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-xl border border-ta-border text-sm font-body font-semibold text-ta-muted bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        show={!!deleteTarget}
        itemType="Kendaraan"
        itemName={deleteTarget?.platNomor || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
