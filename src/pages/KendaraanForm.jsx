import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";

export default function KendaraanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    plat_nomor: "",
    merk: "",
    jenis: "R4",
    tahun: new Date().getFullYear(),
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await api.get(`/kendaraan/${id}`);
        const d = res.data.data;
        setForm({
          plat_nomor: d.platNomor || "",
          merk: d.merk || "",
          jenis: d.jenis || "R4",
          tahun: d.tahun || new Date().getFullYear(),
        });
      } catch {
        navigate("/kendaraan");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) {
        await api.put(`/kendaraan/${id}`, form);
      } else {
        await api.post("/kendaraan", form);
      }
      navigate("/kendaraan");
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.errors) {
        const errMap = {};
        resp.errors.forEach((er) => {
          errMap[er.field] = er.message;
        });
        setErrors(errMap);
      } else {
        setErrors({ _general: resp?.message || "Terjadi kesalahan" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-ta-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero-bg px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-10 lg:pb-14 relative overflow-hidden">
        <div className="wrap relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="eyebrow text-white/80">Manajemen Armada</p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white m-0">
                {isEdit ? "Edit Kendaraan" : "Tambah Kendaraan"}
              </h1>
              <p className="text-sm sm:text-base text-white/70 font-body mt-1">
                {isEdit ? "Perbarui data kendaraan operasional" : "Masukkan data kendaraan baru"}
              </p>
            </div>
            <Link
              to="/kendaraan"
              className="btn-hero-outline inline-flex items-center gap-2 no-underline shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Kembali
            </Link>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none"><path d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,80 L0,80 Z" fill="#F8F8FA"/></svg>
        </div>
      </section>

      <div className="wrap -mt-8 relative z-20 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-ta-border p-6 sm:p-8">
          {errors._general && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-ta-red font-body">
              {errors._general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid-2">
              {/* Plat Nomor */}
              <div>
                <label className="label label-required">Plat Nomor</label>
                <input
                  type="text"
                  name="plat_nomor"
                  value={form.plat_nomor}
                  onChange={handleChange}
                  className={`field ${errors.plat_nomor ? "field-error" : ""}`}
                  placeholder="Contoh: BK 1234 ABC"
                />
                {errors.plat_nomor && <p className="error-msg">{errors.plat_nomor}</p>}
              </div>

              {/* Merk */}
              <div>
                <label className="label">Merk</label>
                <input
                  type="text"
                  name="merk"
                  value={form.merk}
                  onChange={handleChange}
                  className={`field ${errors.merk ? "field-error" : ""}`}
                  placeholder="Contoh: Toyota, Mitsubishi"
                />
                {errors.merk && <p className="error-msg">{errors.merk}</p>}
              </div>

              {/* Jenis */}
              <div>
                <label className="label label-required">Jenis</label>
                <select
                  name="jenis"
                  value={form.jenis}
                  onChange={handleChange}
                  className={`field ${errors.jenis ? "field-error" : ""}`}
                >
                  <option value="R4">R4</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Truck">Truck</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {errors.jenis && <p className="error-msg">{errors.jenis}</p>}
              </div>

              {/* Tahun */}
              <div>
                <label className="label">Tahun</label>
                <input
                  type="number"
                  name="tahun"
                  value={form.tahun}
                  onChange={handleChange}
                  className={`field ${errors.tahun ? "field-error" : ""}`}
                  min={1900}
                  max={new Date().getFullYear()}
                />
                {errors.tahun && <p className="error-msg">{errors.tahun}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-ta-border">
              <Link to="/kendaraan" className="btn-secondary no-underline">
                Batal
              </Link>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    {isEdit ? "Simpan Perubahan" : "Simpan"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
