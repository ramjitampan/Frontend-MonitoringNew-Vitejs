import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PegawaiIndex from "./pages/PegawaiIndex";
import PegawaiForm from "./pages/PegawaiForm";
import KendaraanIndex from "./pages/KendaraanIndex";
import KendaraanForm from "./pages/KendaraanForm";
import PerjalananIndex from "./pages/PerjalananIndex";
import PerjalananForm from "./pages/PerjalananForm";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pegawai" element={<PegawaiIndex />} />
            <Route path="/pegawai/create" element={<PegawaiForm />} />
            <Route path="/pegawai/edit/:id" element={<PegawaiForm />} />
            <Route path="/kendaraan" element={<KendaraanIndex />} />
            <Route path="/kendaraan/create" element={<KendaraanForm />} />
            <Route path="/kendaraan/edit/:id" element={<KendaraanForm />} />
            <Route path="/perjalanan" element={<PerjalananIndex />} />
            <Route path="/perjalanan/create" element={<PerjalananForm />} />
            <Route path="/perjalanan/edit/:id" element={<PerjalananForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
