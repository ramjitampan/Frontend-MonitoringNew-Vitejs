import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import DeleteModal from "../components/DeleteModal";
import { AVATAR_PALETTE } from "../utils/constants";
import { getInitials } from "../utils/format";

// ── Inline SVG icons (no FA dependency) ──────────────────────────────────────
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconPhone = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const IconBriefcase = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconChevronL = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconChevronR = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function PegawaiIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [pegawais, setPegawais] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/pegawai", { params: { page, perPage: 10 } });
      const data = res.data;
      const list = data.data ?? data.pegawais ?? [];
      setPegawais(list);
      // FIX: fallback ke panjang list kalau backend tidak mengirim field `total`
      // (sebelumnya total selalu 0 jika `data.data` dipakai, karena hanya
      // `data.pegawais` yang dicek pada fallback-nya)
      setTotal(data.total ?? list.length);
    } catch {
      setPegawais([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = pegawais.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.nama && p.nama.toLowerCase().includes(q)) || (p.jabatan && p.jabatan.toLowerCase().includes(q)) || (p.divisi && p.divisi.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(total / 10));
  const divisiCount = new Set(filtered.map((p) => p.divisi)).size;

  // FIX: nomor HP sebelumnya selalu tampil "–" karena hanya membaca `no_hp`.
  // Fallback ke beberapa kemungkinan nama field dari API — sesuaikan urutan
  // atau tambahkan nama field asli backend kamu jika masih belum muncul.
  const getPhone = (p) => p.no_hp ?? p.no_telp ?? p.noHp ?? p.phone ?? p.telepon ?? null;

  const handleDelete = async () => {
    try {
      await api.delete(`/pegawai/${deleteModal.id}`);
      setDeleteModal({ show: false, id: null, name: "" });
      fetchData();
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="hero-bg-pegawai relative w-full overflow-hidden">
        {/* deco circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border-[48px] border-white/[.05] pointer-events-none" />
        <div className="absolute top-4 right-1/3  w-44 h-44 rounded-full border-[28px] border-white/[.04] pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-56 h-56 rounded-full border-[36px] border-white/[.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">PT. Telkom Akses Binjai</p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">Data Pegawai</h1>
              <p className="mt-2 max-w-md text-sm text-white/65 leading-relaxed">Kelola dan pantau seluruh data pegawai pengemudi kendaraan operasional.</p>
            </div>
            <Link
              to="/pegawai/create"
              className="self-start sm:self-center group inline-flex items-center gap-2.5 rounded-2xl bg-white text-ta-dark px-5 py-3 text-sm font-bold shadow-xl hover:bg-ta-soft hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200 no-underline shrink-0"
            >
              <span className="w-7 h-7 rounded-xl bg-ta-red group-hover:bg-ta-dark flex items-center justify-center text-white transition-colors">
                <IconPlus />
              </span>
              Tambah Pegawai
            </Link>
          </div>
        </div>
      </div>

      {/* ── KONTEN ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-5">
        {/* ── Toolbar: stat pills solid + search dalam satu baris ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-up">
          <div className="flex items-center bg-ta-red rounded-2xl divide-x divide-white/20 shadow-md overflow-hidden shrink-0">
            <div className="flex items-center gap-2 px-4 py-3">
              <IconUsers className="text-white/80" />
              <span className="text-white font-bold text-sm tabular-nums">{total}</span>
              <span className="text-white/70 text-xs font-semibold">Pegawai</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-white font-bold text-sm tabular-nums">{divisiCount}</span>
              <span className="text-white/70 text-xs font-semibold">Divisi</span>
            </div>
          </div>

          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-4 h-[52px] shadow-sm focus-within:border-ta-red focus-within:ring-2 focus-within:ring-ta-red/10 transition-all">
              <span className="text-gray-400 shrink-0">
                <IconSearch />
              </span>
              <input type="text" placeholder="Cari nama, jabatan, divisi…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" />
              {search && (
                <button onClick={() => setSearch("")} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 text-xs transition-colors shrink-0">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── TABLE CARD ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fade-up">
          {/* loading bar */}
          {loading && <div className="h-0.5 w-full bg-gradient-to-r from-ta-red via-red-400 to-ta-red animate-pulse" />}

          {filtered.length > 0 ? (
            <>
              {/* Card header */}
              <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h2 className="font-display font-bold text-gray-800 text-[15px]">Daftar Pegawai</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Semua pengemudi kendaraan operasional</p>
                </div>
                {search && (
                  <span className="flex items-center gap-1.5 bg-ta-soft text-ta-red text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100">
                    <IconSearch /> "{search}"
                  </span>
                )}
              </div>

              {/* ── DESKTOP TABLE ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ background: "rgba(0,0,0,0.02)" }}>
                      {["#", "Pegawai", "Jabatan", "Divisi", "No. HP", "Aksi"].map((h, i) => (
                        <th key={h} className={`text-[10px] font-bold uppercase tracking-[.16em] text-gray-400 py-3.5 ${i === 0 ? "pl-6 pr-3 w-10" : i === 5 ? "pr-6 pl-4 text-right" : "px-4"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((pegawai, i) => {
                      const color = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                      const initials = getInitials(pegawai.nama);
                      const phone = getPhone(pegawai);
                      return (
                        <tr key={pegawai.id} className="group hover:bg-gray-50/60 transition-colors duration-100">
                          {/* # */}
                          <td className="pl-6 pr-3 py-4">
                            <span className="text-xs font-bold text-gray-300 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                          </td>

                          {/* Pegawai */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm" style={{ background: color }}>
                                {initials}
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-[13px] leading-snug">{pegawai.nama}</p>
                                <p className="text-[10.5px] text-gray-400 font-mono mt-0.5">ID #{String(pegawai.id).padStart(3, "0")}</p>
                              </div>
                            </div>
                          </td>

                          {/* Jabatan */}
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 text-[11px] font-semibold px-3 py-1.5 rounded-full">
                              <IconBriefcase /> {pegawai.jabatan}
                            </span>
                          </td>

                          {/* Divisi */}
                          <td className="px-4 py-4">
                            <span className="inline-block bg-ta-red text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">{pegawai.divisi}</span>
                          </td>

                          {/* No. HP */}
                          <td className="px-4 py-4">
                            {phone ? (
                              <a href={"tel:" + phone} className="group/ph inline-flex items-center gap-2 text-[12px] text-gray-500 hover:text-ta-red transition-colors no-underline">
                                <span className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 group-hover/ph:bg-ta-red group-hover/ph:border-ta-red transition-all">
                                  <span className="text-gray-400 group-hover/ph:text-white transition-colors">
                                    <IconPhone />
                                  </span>
                                </span>
                                <span className="font-mono">{phone}</span>
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-[12px] text-gray-300">
                                <span className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                                  <IconPhone />
                                </span>
                                <span className="font-mono">—</span>
                              </span>
                            )}
                          </td>

                          {/* Aksi */}
                          <td className="pr-6 pl-4 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={"/pegawai/edit/" + pegawai.id}
                                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center transition-all duration-150 no-underline"
                              >
                                <IconEdit />
                              </Link>
                              <button
                                onClick={() => setDeleteModal({ show: true, id: pegawai.id, name: pegawai.nama })}
                                className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-ta-red hover:text-white hover:border-ta-red hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center transition-all duration-150 cursor-pointer"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE CARDS ── */}
              <div className="md:hidden divide-y divide-gray-100">
                {filtered.map((pegawai, i) => {
                  const color = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                  const initials = getInitials(pegawai.nama);
                  const phone = getPhone(pegawai);
                  return (
                    <div key={pegawai.id} className="p-4 space-y-3">
                      {/* Top: avatar + nama + aksi */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm" style={{ background: color }}>
                          {initials}
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-[14px] truncate">{pegawai.nama}</p>
                          <p className="text-[10.5px] text-gray-400 font-mono mt-0.5">ID #{String(pegawai.id).padStart(3, "0")}</p>
                        </div>
                        {/* inline aksi */}
                        <div className="flex gap-1.5 shrink-0">
                          <Link
                            to={"/pegawai/edit/" + pegawai.id}
                            className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all no-underline"
                          >
                            <IconEdit />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: pegawai.id, name: pegawai.nama })}
                            className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-ta-red hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>

                      {/* Info row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Jabatan</p>
                          <p className="text-[11.5px] font-semibold text-gray-700 leading-snug truncate">{pegawai.jabatan}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Divisi</p>
                          <span className="inline-block bg-ta-red text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full">{pegawai.divisi}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">No. HP</p>
                          {phone ? (
                            <a href={"tel:" + phone} className="text-[11px] font-mono text-gray-600 hover:text-ta-red transition-colors no-underline truncate block">
                              {phone}
                            </a>
                          ) : (
                            <span className="text-[11px] font-mono text-gray-300 truncate block">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── PAGINATION ── */}
              <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-[11.5px] text-gray-500">
                  Menampilkan <span className="font-bold text-gray-700 tabular-nums">{filtered.length}</span> dari <span className="font-bold text-gray-700 tabular-nums">{total}</span> pegawai
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setSearchParams({ page: String(page - 1) })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  >
                    <IconChevronL /> Sebelumnya
                  </button>
                  <span className="text-xs text-gray-400 font-medium tabular-nums px-1">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setSearchParams({ page: String(page + 1) })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  >
                    Selanjutnya <IconChevronR />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── EMPTY STATE ── */
            <div className="py-24 flex flex-col items-center gap-5 px-6 text-center animate-fade-up">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <svg className="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ta-red flex items-center justify-center">
                  <IconPlus />
                </div>
              </div>
              <div>
                <p className="font-display font-bold text-gray-700 text-lg">{search ? `Tidak ada hasil untuk "${search}"` : "Belum Ada Pegawai"}</p>
                <p className="text-gray-400 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {search ? "Coba kata kunci lain atau hapus filter pencarian." : "Tambahkan pegawai pertama untuk mulai memantau penggunaan BBM kendaraan operasional."}
                </p>
              </div>
              {!search && (
                <Link to="/pegawai/create" className="inline-flex items-center gap-2 bg-ta-red hover:bg-ta-dark text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 no-underline">
                  <IconPlus /> Tambah Pegawai Pertama
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal show={deleteModal.show} itemName={deleteModal.name} itemType="Pegawai" onConfirm={handleDelete} onCancel={() => setDeleteModal({ show: false, id: null, name: "" })} />
    </>
  );
}
