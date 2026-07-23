import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-ta-ink">Masuk</h1>
          <p className="text-sm text-ta-muted mt-1">Sistem Monitoring BBM — PT Telkom Akses Binjai</p>
        </div>

        <div className="bg-white border border-ta-border rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-ta-muted mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="field"
                placeholder="admin@telkomakses.co.id"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-ta-muted mb-2">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-ta-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-ta-border text-ta-red focus:ring-ta-red"
                />
                Ingat saya
              </label>
            </div>

            {error && (
              <p className="text-ta-red text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-ta-red to-ta-dark text-white font-semibold text-sm py-3 rounded-xl hover:brightness-105 transition-all disabled:opacity-60 cursor-pointer"
            >
              <i className="fa-solid fa-right-to-bracket mr-2"></i>
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
