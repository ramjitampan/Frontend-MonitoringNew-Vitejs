import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";

export default function PegawaiForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ nama: "", jabatan: "", divisi: "", no_hp: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/pegawai/${id}`).then((res) => {
        const p = res.data.pegawai ?? res.data.data ?? res.data;
        setForm({
          nama: p.nama || "",
          jabatan: p.jabatan || "",
          divisi: p.divisi || "",
          no_hp: p.no_hp || "",
        });
      }).catch(() => {});
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isEditing) {
        await api.put(`/pegawai/${id}`, form);
      } else {
        await api.post("/pegawai", form);
      }
      navigate("/pegawai");
    } catch (err) {
      const res = err.response;
      if (res?.status === 422 && res.data?.errors) {
        const fieldErrors = {};
        for (const [field, msgs] of Object.entries(res.data.errors)) {
          fieldErrors[field] = msgs[0];
        }
        setErrors(fieldErrors);
      } else if (res?.data?.message) {
        setErrors({ _global: res.data.message });
      } else {
        setErrors({ _global: "Terjadi kesalahan. Silakan coba lagi." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <div className="hero-bg-pegawai relative w-full overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border-[48px] border-white/[.05] pointer-events-none"></div>
        <div className="absolute top-6 right-1/3 w-44 h-44 rounded-full border-[28px] border-white/[.04] pointer-events-none"></div>
        <div className="absolute -bottom-12 left-1/4 w-56 h-56 rounded-full border-[36px] border-white/[.03] pointer-events-none"></div>

        <div className="wrap py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {isEditing ? "Edit Pegawai" : "Tambah Pegawai"}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                {isEditing
                  ? "Ubah data pegawai pengemudi kendaraan operasional."
                  : "Isi data pegawai pengemudi kendaraan operasional baru."}
              </p>
            </div>

            <Link
              to="/pegawai"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors no-underline"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {errors._global && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
            <p className="text-red-700 text-sm font-semibold">{errors._global}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div>
                <label className="label" htmlFor="nama">
                  Nama <span className="label-required">*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Nama lengkap pegawai"
                  required
                  className={"field" + (errors.nama ? " field-error" : "")}
                />
                {errors.nama && <p className="error-msg">{errors.nama}</p>}
              </div>
              <div>
                <label className="label" htmlFor="jabatan">Jabatan</label>
                <input
                  type="text"
                  id="jabatan"
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  placeholder="Contoh: Staff"
                  className={"field" + (errors.jabatan ? " field-error" : "")}
                />
                {errors.jabatan && <p className="error-msg">{errors.jabatan}</p>}
              </div>
            </div>

            <div className="grid-2 mt-5">
              <div>
                <label className="label" htmlFor="divisi">Divisi</label>
                <input
                  type="text"
                  id="divisi"
                  name="divisi"
                  value={form.divisi}
                  onChange={handleChange}
                  placeholder="Contoh: Operasional"
                  className={"field" + (errors.divisi ? " field-error" : "")}
                />
                {errors.divisi && <p className="error-msg">{errors.divisi}</p>}
              </div>
              <div>
                <label className="label" htmlFor="no_hp">No HP</label>
                <input
                  type="text"
                  id="no_hp"
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                  className={"field" + (errors.no_hp ? " field-error" : "")}
                />
                {errors.no_hp && <p className="error-msg">{errors.no_hp}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <button type="submit" disabled={loading} className="btn-primary cursor-pointer disabled:opacity-60">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {loading ? "Menyimpan..." : isEditing ? "Update Pegawai" : "Simpan Pegawai"}
              </button>
              <Link to="/pegawai" className="btn-secondary no-underline">
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
