import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";

export default function PerjalananForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    pegawai_id: "",
    kendaraan_id: "",
    tanggal: "",
    tujuan: "",
    uraian: "",
    km_lama: "",
    km_baru: "",
    jumlah_biaya: "",
    harga_per_liter: "",
    no_bon: "",
    foto_bon: null,
  });
  const [pegawaiList, setPegawaiList] = useState([]);
  const [kendaraanList, setKendaraanList] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [pegRes, kenRes] = await Promise.all([
          api.get("/pegawai", { params: { perPage: 100 } }),
          api.get("/kendaraan", { params: { perPage: 100 } }),
        ]);
        setPegawaiList(pegRes.data.data || []);
        setKendaraanList(kenRes.data.data || []);
      } catch {
        //
      } finally {
        if (!isEdit) setLoading(false);
      }
    })();
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await api.get(`/perjalanan/${id}`);
        const d = res.data.data;
        setForm({
          pegawai_id: d.pegawai?.id || "",
          kendaraan_id: d.kendaraan?.id || "",
          tanggal: d.tanggal || "",
          tujuan: d.tujuan || "",
          uraian: d.uraian || "",
          km_lama: d.odometer?.km_lama ?? "",
          km_baru: d.odometer?.km_baru ?? "",
          jumlah_biaya: d.bbm?.jumlah_biaya ?? "",
          harga_per_liter: d.bbm?.harga_per_liter ?? "",
          no_bon: d.bbm?.no_bon || "",
          foto_bon: null,
        });
      } catch {
        navigate("/perjalanan");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto_bon") {
      setForm((prev) => ({ ...prev, foto_bon: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setWarning(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setWarning(null);
    try {
      const payload = {
        pegawai_id: Number(form.pegawai_id),
        kendaraan_id: Number(form.kendaraan_id),
        tanggal: form.tanggal,
        tujuan: form.tujuan,
        uraian: form.uraian || null,
        km_lama: Number(form.km_lama),
        km_baru: Number(form.km_baru),
        jumlah_biaya: Number(form.jumlah_biaya),
        harga_per_liter: Number(form.harga_per_liter),
        no_bon: form.no_bon || null,
      };

      if (isEdit) {
        const res = await api.put(`/perjalanan/${id}`, payload);
        const saved = res.data.data;
        const flags = saved?.monitoring?.fraud_flags || {};
        if (flags.status_anomali === "Anomali" || flags.status_anomali === "Perlu Verifikasi") {
          setWarning({
            type: "warning",
            message: flags.status_anomali === "Anomali"
              ? "Data disimpan. Status: Anomali. Data perjalanan perlu diverifikasi lebih lanjut."
              : "Data disimpan. Status: Perlu Verifikasi. Terdapat indikasi yang perlu diperiksa.",
          });
          setSaving(false);
          return;
        }
        navigate("/perjalanan");
      } else {
        const res = await api.post("/perjalanan", payload);
        const saved = res.data.data;
        const flags = saved?.monitoring?.fraud_flags || {};
        if (flags.status_anomali === "Anomali" || flags.status_anomali === "Perlu Verifikasi") {
          setWarning({
            type: "warning",
            message: flags.status_anomali === "Anomali"
              ? "Data disimpan. Status: Anomali. Data perjalanan perlu diverifikasi lebih lanjut."
              : "Data disimpan. Status: Perlu Verifikasi. Terdapat indikasi yang perlu diperiksa.",
          });
          setSaving(false);
          return;
        }
        navigate("/perjalanan");
      }
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
              <p className="eyebrow text-white/80">Monitoring BBM</p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white m-0">
                {isEdit ? "Edit Perjalanan" : "Tambah Perjalanan"}
              </h1>
              <p className="text-sm sm:text-base text-white/70 font-body mt-1">
                {isEdit ? "Perbarui data perjalanan BBM" : "Catat perjalanan baru dan konsumsi BBM"}
              </p>
            </div>
            <Link
              to="/perjalanan"
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

          {warning && (
            <div className={`mb-6 p-4 rounded-xl border text-sm font-body flex items-start gap-3 ${
              warning.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <p className="font-semibold m-0">Peringatan</p>
                <p className="m-0 mt-1">{warning.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid-2">
              {/* Pegawai */}
              <div>
                <label className="label label-required">Pegawai</label>
                <select
                  name="pegawai_id"
                  value={form.pegawai_id}
                  onChange={handleChange}
                  className={`field ${errors.pegawai_id ? "field-error" : ""}`}
                >
                  <option value="">Pilih Pegawai</option>
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
                {errors.pegawai_id && <p className="error-msg">{errors.pegawai_id}</p>}
              </div>

              {/* Kendaraan */}
              <div>
                <label className="label label-required">Kendaraan</label>
                <select
                  name="kendaraan_id"
                  value={form.kendaraan_id}
                  onChange={handleChange}
                  className={`field ${errors.kendaraan_id ? "field-error" : ""}`}
                >
                  <option value="">Pilih Kendaraan</option>
                  {kendaraanList.map((k) => (
                    <option key={k.id} value={k.id}>{k.platNomor} - {k.merk}</option>
                  ))}
                </select>
                {errors.kendaraan_id && <p className="error-msg">{errors.kendaraan_id}</p>}
              </div>

              {/* Tanggal */}
              <div>
                <label className="label label-required">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className={`field ${errors.tanggal ? "field-error" : ""}`}
                />
                {errors.tanggal && <p className="error-msg">{errors.tanggal}</p>}
              </div>

              {/* Tujuan */}
              <div>
                <label className="label label-required">Tujuan</label>
                <input
                  type="text"
                  name="tujuan"
                  value={form.tujuan}
                  onChange={handleChange}
                  className={`field ${errors.tujuan ? "field-error" : ""}`}
                  placeholder="Contoh: Kantor Pusat"
                />
                {errors.tujuan && <p className="error-msg">{errors.tujuan}</p>}
              </div>

              {/* Uraian (full width) */}
              <div className="sm:col-span-2">
                <label className="label">Uraian</label>
                <textarea
                  name="uraian"
                  value={form.uraian}
                  onChange={handleChange}
                  className={`field ${errors.uraian ? "field-error" : ""}`}
                  rows={3}
                  placeholder="Deskripsi perjalanan (opsional)"
                />
                {errors.uraian && <p className="error-msg">{errors.uraian}</p>}
              </div>

              {/* KM Lama */}
              <div>
                <label className="label label-required">KM Lama</label>
                <input
                  type="number"
                  name="km_lama"
                  value={form.km_lama}
                  onChange={handleChange}
                  className={`field ${errors.km_lama ? "field-error" : ""}`}
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
                {errors.km_lama && <p className="error-msg">{errors.km_lama}</p>}
              </div>

              {/* KM Baru */}
              <div>
                <label className="label label-required">KM Baru</label>
                <input
                  type="number"
                  name="km_baru"
                  value={form.km_baru}
                  onChange={handleChange}
                  className={`field ${errors.km_baru ? "field-error" : ""}`}
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
                {errors.km_baru && <p className="error-msg">{errors.km_baru}</p>}
              </div>

              {/* Jumlah Biaya */}
              <div>
                <label className="label label-required">Jumlah Biaya (Rp)</label>
                <input
                  type="number"
                  name="jumlah_biaya"
                  value={form.jumlah_biaya}
                  onChange={handleChange}
                  className={`field ${errors.jumlah_biaya ? "field-error" : ""}`}
                  min="0"
                  step="1000"
                  placeholder="Contoh: 51000"
                />
                {errors.jumlah_biaya && <p className="error-msg">{errors.jumlah_biaya}</p>}
              </div>

              {/* Harga per Liter */}
              <div>
                <label className="label label-required">Harga per Liter (Rp)</label>
                <input
                  type="number"
                  name="harga_per_liter"
                  value={form.harga_per_liter}
                  onChange={handleChange}
                  className={`field ${errors.harga_per_liter ? "field-error" : ""}`}
                  min="0"
                  step="100"
                  placeholder="Contoh: 10000"
                />
                {errors.harga_per_liter && <p className="error-msg">{errors.harga_per_liter}</p>}
              </div>

              {/* No Bon */}
              <div>
                <label className="label">No Bon</label>
                <input
                  type="text"
                  name="no_bon"
                  value={form.no_bon}
                  onChange={handleChange}
                  className={`field ${errors.no_bon ? "field-error" : ""}`}
                  placeholder="Nomor bon (opsional)"
                />
                {errors.no_bon && <p className="error-msg">{errors.no_bon}</p>}
              </div>

              {/* Foto Bon */}
              <div>
                <label className="label">Foto Bon</label>
                <input
                  type="file"
                  name="foto_bon"
                  accept="image/*"
                  onChange={handleChange}
                  className="field file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-ta-soft file:text-ta-red hover:file:bg-red-200 file:cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-ta-border">
              <Link to="/perjalanan" className="btn-secondary no-underline">
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
