# Buku Panduan Handover — Frontend Bensin Monitoring

**PT. Telkom Akses Binjai**

Dokumen ini disusun sebagai panduan serah terima (handover) untuk pengembang yang akan melanjutkan pengembangan dan pemeliharaan aplikasi **Sistem Monitoring BBM** pada lingkungan frontend. Bacalah dokumen ini dengan saksama sebelum memulai pekerjaan.

---

## Daftar Isi

1. [Tentang Aplikasi](#1-tentang-aplikasi)
2. [Arsitektur Frontend](#2-arsitektur-frontend)
3. [Struktur Folder](#3-struktur-folder)
4. [Teknologi yang Digunakan](#4-teknologi-yang-digunakan)
5. [Halaman dan Rute](#5-halaman-dan-rute)
6. [Komponen UI](#6-komponen-ui)
7. [Alur Autentikasi](#7-alur-autentikasi)
8. [Komunikasi dengan Backend](#8-komunikasi-dengan-backend)
9. [Fitur-Fitur Utama](#9-fitur-fitur-utama)
10. [Panduan Pengembangan](#10-panduan-pengembangan)
11. [Catatan Penting](#11-catatan-penting)
12. [Kontak](#12-kontak)

---

## 1. Tentang Aplikasi

**Sistem Monitoring BBM** adalah aplikasi berbasis web untuk memantau, mencatat, dan mengevaluasi penggunaan bahan bakar minyak (BBM) kendaraan operasional di lingkungan PT. Telkom Akses Cabang Binjai.

Aplikasi ini mencakup tiga modul bisnis utama:

- **Manajemen Pegawai** — Data pengemudi kendaraan operasional
- **Manajemen Kendaraan** — Data kendaraan operasional
- **Pencatatan Perjalanan** — Catatan pemakaian BBM setiap perjalanan, dilengkapi deteksi anomali dan validasi otomatis

Frontend dibangun menggunakan **React 19** dengan **Vite 8** dan **Tailwind CSS v4**, dirancang dengan tema profesional dan responsif untuk perangkat desktop maupun seluler.

---

## 2. Arsitektur Frontend

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
├─────────────────────────────────────────────┤
│              React 19 + Vite 8              │
├─────────────────────────────────────────────┤
│  Pages ─── Components ─── Contexts ─── Utils │
├─────────────────────────────────────────────┤
│        Axios → /api (proxy Vite)            │
├─────────────────────────────────────────────┤
│        Backend Express.js (:5000)           │
├─────────────────────────────────────────────┤
│              MariaDB / MySQL                │
└─────────────────────────────────────────────┘
```

### Alur Data

1. Pengguna berinteraksi dengan halaman (Pages)
2. Halaman memanggil API melalui Axios instance (`src/api.js`)
3. Vite dev-server mem-proxy request `/api` ke backend (`localhost:5000`)
4. Backend memproses dan mengembalikan response JSON
5. Response di-render menjadi tampilan oleh komponen React

---

## 3. Struktur Folder

```
frontend/
├── public/                          # Aset statis
│   ├── favicon.svg
│   ├── icons.svg
│   └── foto/                        # Logo dan gambar
│       ├── Image2.png               # Logo navbar
│       └── image.png                # Logo footer
│
├── src/
│   ├── assets/                      # Gambar (hero.png, dll)
│   ├── components/                  # Komponen React
│   │   ├── ui/                      # Komponen UI umum
│   │   │   ├── Badge.jsx            # Status badge
│   │   │   ├── Card.jsx             # Kartu umum
│   │   │   ├── EmptyState.jsx       # Tampilan data kosong
│   │   │   ├── FeatureCard.jsx      # Kartu fitur dashboard
│   │   │   ├── LoadingSkeleton.jsx  # Skeleton loading
│   │   │   ├── PageHeader.jsx       # Header halaman
│   │   │   ├── Pagination.jsx       # Navigasi halaman
│   │   │   └── StatCard.jsx         # Kartu statistik
│   │   ├── Layout.jsx               # Layout utama (navbar + footer)
│   │   ├── ProtectedRoute.jsx       # Guard autentikasi
│   │   └── DeleteModal.jsx          # Modal konfirmasi hapus
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx           # State autentikasi global
│   │
│   ├── hooks/
│   │   └── useFetch.js              # Custom hook fetch data
│   │
│   ├── pages/                       # Halaman aplikasi
│   │   ├── Dashboard.jsx            # Beranda
│   │   ├── Login.jsx                # Login
│   │   ├── PegawaiIndex.jsx         # Daftar pegawai
│   │   ├── PegawaiForm.jsx          # Tambah/edit pegawai
│   │   ├── KendaraanIndex.jsx       # Daftar kendaraan
│   │   ├── KendaraanForm.jsx        # Tambah/edit kendaraan
│   │   ├── PerjalananIndex.jsx      # Daftar perjalanan
│   │   └── PerjalananForm.jsx       # Tambah/edit perjalanan
│   │
│   ├── utils/
│   │   ├── constants.js             # Konstanta (bulan, status, dll)
│   │   └── format.js                # Fungsi formatting
│   │
│   ├── api.js                       # Axios instance + interceptor
│   ├── App.jsx                      # Routing
│   ├── App.css
│   ├── index.css                    # Tailwind + custom styles
│   └── main.jsx                     # Entry point React
│
├── index.html                       # Entry point HTML
├── vite.config.js                   # Konfigurasi Vite
├── package.json
├── README.md
├── HANDOVER.md                      # Dokumen ini
└── DEPLOYMENT.md                    # Panduan deployment
```

---

## 4. Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | ^19.2.7 | Framework UI |
| Vite | ^8.1.1 | Build tool & dev server |
| Tailwind CSS | ^4.3.3 | Utility-first CSS |
| React Router | ^7.18.1 | Routing SPA |
| Axios | ^1.18.1 | HTTP client |
| Lucide React | ^1.25.0 | Ikon SVG |
| Recharts | ^3.10.0 | Grafik (tersedia, belum dipakai) |
| Oxlint | ^1.71.0 | Linter |

### Catatan Teknis

- **Module type:** `"type": "module"` (ESM)
- **CSS framework:** Tailwind CSS v4 (bukan v3 — konfigurasi via CSS, bukan `tailwind.config.js`)
- **Tidak ada Bootstrap, MUI, atau komponen library eksternal** — semua komponen dibangun manual dengan Tailwind
- **React Compiler:** Tersedia di konfigurasi tetapi belum diaktifkan

---

## 5. Halaman dan Rute

| Rute | Halaman | Deskripsi |
|------|---------|-----------|
| `/` | Dashboard | Beranda dengan statistik dan fitur |
| `/login` | Login | Halaman masuk pengguna |
| `/pegawai` | PegawaiIndex | Daftar pegawai (tema gelap) |
| `/pegawai/create` | PegawaiForm | Tambah pegawai baru |
| `/pegawai/edit/:id` | PegawaiForm | Edit pegawai |
| `/kendaraan` | KendaraanIndex | Daftar kendaraan |
| `/kendaraan/create` | KendaraanForm | Tambah kendaraan baru |
| `/kendaraan/edit/:id` | KendaraanForm | Edit kendaraan |
| `/perjalanan` | PerjalananIndex | Daftar perjalanan (halaman utama) |
| `/perjalanan/create` | PerjalananForm | Tambah perjalanan baru |
| `/perjalanan/edit/:id` | PerjalananForm | Edit perjalanan |

Rute didefinisikan di `src/App.jsx` menggunakan `react-router-dom` v7 dengan struktur `BrowserRouter` → `Routes` → `Route`.

---

## 6. Komponen UI

Semua komponen UI berada di `src/components/ui/` dan dibangun dengan Tailwind CSS.

### Daftar Komponen

| Komponen | Props | Deskripsi |
|----------|-------|-----------|
| **Badge** | `status` (Balance/Boros/Anomali) | Lencana status efisiensi |
| **Card** | `children`, `className` | Pembungkus kartu generik |
| **EmptyState** | `icon`, `title`, `description`, `actionLabel`, `actionTo`, `onAction` | Tampilan data kosong |
| **FeatureCard** | `icon`, `title`, `description` | Kartu fitur di dashboard |
| **LoadingSkeleton** | `rows` | Animasi loading |
| **PageHeader** | `eyebrow`, `title`, `description`, `children` | Header hero section |
| **Pagination** | `page`, `lastPage`, `total`, `onPageChange` | Navigasi halaman |
| **StatCard** | `icon`, `label`, `value`, `color`, `subtitle` | Kartu statistik |

### Komponen Lainnya

| Komponen | File | Fungsi |
|----------|------|--------|
| Layout | `Layout.jsx` | Navbar + footer untuk semua halaman |
| ProtectedRoute | `ProtectedRoute.jsx` | Guard route (cek autentikasi) |
| DeleteModal | `DeleteModal.jsx` | Modal konfirmasi penghapusan |

---

## 7. Alur Autentikasi

Autentikasi dikelola melalui `AuthContext.jsx` yang menggunakan React Context.

### State Global

```javascript
{
  user: { id, nama, email } | null,
  token: string | null,
  isAuthenticated: boolean
}
```

### Alur Login

1. Pengguna mengisi form email & password di halaman `/login`
2. Request POST ke `/api/auth/login`
3. Backend mengembalikan JWT token
4. Token disimpan di `localStorage` dengan key `"token"`
5. State auth diperbarui, navigasi ke halaman utama

### Alur Logout

1. Token dihapus dari `localStorage`
2. State auth di-reset
3. Navigasi ke `/login`

### Proteksi Route

Halaman yang membutuhkan autentikasi dibungkus dengan komponen `ProtectedRoute`. Jika pengguna belum login, akan diarahkan ke `/login`.

> **Catatan:** Saat ini autentikasi sudah tersedia di backend, tetapi penggunaannya di frontend belum diaktifkan penuh. Silakan sesuaikan `ProtectedRoute` sesuai kebutuhan.

---

## 8. Komunikasi dengan Backend

### Axios Instance (`src/api.js`)

```javascript
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
```

### Interceptor Request

Setiap request otomatis menyertakan header:

```
Authorization: Bearer <token>
```

Token diambil dari `localStorage.getItem("token")`.

### Interceptor Response

Jika response HTTP 401 (Unauthorized), token dan data pengguna dihapus, lalu redirect ke `/login`.

### Proxy Vite

Di lingkungan development (`npm run dev`), Vite mem-proxy seluruh request `/api` ke backend:

```javascript
// vite.config.js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
    },
  },
}
```

Di lingkungan production, frontend build (`dist/`) bisa disajikan oleh backend atau web server terpisah. Pastikan URL API sudah benar.

### Endpoint API yang Dipanggil Frontend

| Metode | Endpoint | Dipanggil Dari |
|--------|----------|----------------|
| GET | `/api/perjalanan` | PerjalananIndex |
| GET | `/api/perjalanan/:id` | PerjalananForm, DetailModal |
| POST | `/api/perjalanan` | PerjalananForm |
| PUT | `/api/perjalanan/:id` | PerjalananForm |
| DELETE | `/api/perjalanan/:id` | PerjalananIndex |
| GET | `/api/perjalanan/export/excel` | PerjalananIndex (export) |
| GET | `/api/pegawai` | PegawaiIndex |
| GET | `/api/pegawai/:id` | PegawaiForm |
| POST | `/api/pegawai` | PegawaiForm |
| PUT | `/api/pegawai/:id` | PegawaiForm |
| DELETE | `/api/pegawai/:id` | PegawaiIndex |
| GET | `/api/kendaraan` | KendaraanIndex |
| GET | `/api/kendaraan/:id` | KendaraanForm |
| POST | `/api/kendaraan` | KendaraanForm |
| PUT | `/api/kendaraan/:id` | KendaraanForm |
| DELETE | `/api/kendaraan/:id` | KendaraanIndex |
| GET | `/api/dashboard` | Dashboard |
| POST | `/api/auth/login` | Login |

---

## 9. Fitur-Fitur Utama

### 9.1 Dashboard (`/`)

Halaman beranda dengan:
- **Hero section** — Sambutan dan gambaran sistem
- **Statistik ringkasan** — Total pegawai, kendaraan, dan perjalanan
- **Fitur cards** — Navigasi cepat ke modul-modul utama
- **Footer** — Informasi perusahaan dan peta lokasi

### 9.2 Manajemen Pegawai (`/pegawai`)

- **Tampilan daftar** dengan tema gelap (dark mode)
- **Pencarian** — Filter berdasarkan nama, jabatan, atau divisi (client-side)
- **Avatar** — Inisial dengan warna palet
- **Indikator status online** — Dot hijau pada avatar
- **Mobile cards** — Tampilan kartu pada perangkat seluler
- **Pagination** — Navigasi halaman
- **CRUD** — Tambah, edit, dan hapus pegawai

### 9.3 Manajemen Kendaraan (`/kendaraan`)

- **Tampilan daftar** dengan tabel dan mobile cards
- **Pencarian** — Server-side search
- **Filter status** — Status pemakaian kendaraan
- **CRUD** — Tambah, edit, dan hapus kendaraan

### 9.4 Manajemen Perjalanan (`/perjalanan`) — Halaman Utama

Halaman paling kompleks dengan fitur:

- **Hero section** — Header merah dengan export Excel dan tombol tambah
- **Stat cards** — Total perjalanan, total biaya BBM, perlu verifikasi, anomali
- **Rekap per pegawai** — Ringkasan agregat per pengemudi
- **Detail Perjalanan** — Tabel utama dengan informasi lengkap:
  - Tanggal, pegawai, tujuan, kendaraan, nomor polisi
  - Odometer (KM lama, KM baru, jarak)
  - Bon BBM (nomor bon, harga/liter, jumlah)
  - Efisiensi dan status (Balance / Boros / Anomali)
  - Validasi dengan tombol Detail
  - Aksi edit dan hapus
- **Filter toolbar** — Filter bulan, tahun, dan pencarian teks
- **Detail Modal** — Informasi validasi lengkap, fraud flags, timeline
- **Export Excel** — Download laporan bulanan
- **Mobile cards** — Tampilan kartu pada perangkat seluler
- **Pagination** — Navigasi halaman

### 9.5 Filter dan Pencarian Perjalanan

Terdapat toolbar filter khusus di dalam kartu "Detail Perjalanan" yang terdiri dari:

- **Dropdown Bulan** — Januari hingga Desember (default: bulan berjalan)
- **Dropdown Tahun** — Rentang 5 tahun (default: tahun berjalan)
- **Input Search** — Pencarian server-side dengan debounce 400ms
- **Tombol Reset** — Kembali ke filter default
- **Info data** — Menampilkan jumlah data yang ditampilkan

Pencarian mencakup field: nama pegawai, tujuan, jenis kendaraan, nomor polisi, dan nomor bon BBM.

---

## 10. Panduan Pengembangan

### 10.1 Menjalankan Development Server

```bash
cd frontend
npm install        # Install dependencies (pertama kali)
npm run dev        # Menjalankan dev server di :5173
```

Backend juga harus berjalan:

```bash
cd backend
npm install
npx prisma generate
npm run dev        # Server API di :5000
```

### 10.2 Build untuk Production

```bash
npm run build      # Output ke folder dist/
npm run preview    # Preview build lokal
```

### 10.3 Menambahkan Halaman Baru

1. Buat file baru di `src/pages/` (contoh: `LaporanIndex.jsx`)
2. Tambahkan rute di `src/App.jsx`
3. Gunakan komponen UI yang sudah ada (`PageHeader`, `Card`, dll.)
4. Panggil API menggunakan `api` dari `src/api.js`

### 10.4 Menambahkan Komponen UI Baru

1. Buat file di `src/components/ui/` (atau `src/components/` jika spesifik)
2. Gunakan Tailwind CSS untuk styling — jangan gunakan CSS manual kecuali diperlukan
3. Periksa komponen yang sudah ada sebelum membuat baru

### 10.5 Konvensi Penamaan

- **File:** PascalCase untuk komponen (`PegawaiIndex.jsx`), camelCase untuk utilitas (`format.js`)
- **Fungsi:** camelCase (`handleSearchChange`, `fetchData`)
- **State:** camelCase deskriptif (`filterBulan`, `searchQuery`)
- **CSS Class:** Gunakan Tailwind utility classes, hindari CSS kustom

### 10.6 Linting

```bash
npm run lint       # Menjalankan oxlint
```

---

## 11. Catatan Penting

### 11.1 Tailwind CSS v4

Proyek ini menggunakan **Tailwind CSS v4** yang memiliki perbedaan signifikan dengan v3:

- Konfigurasi dilakukan di `src/index.css` menggunakan `@import "tailwindcss"` — bukan `tailwind.config.js`
- Plugin Vite: `@tailwindcss/vite` bukan `@vitejs/plugin-tailwindcss`
- Sintaks baru untuk `@apply`, `@theme`, dll. Lihat dokumentasi Tailwind v4.

### 11.2 Tidak Ada File `.env` di Frontend

Frontend tidak menggunakan file `.env`. Semua konfigurasi dikelola melalui:

- **API Base URL:** Langsung di `src/api.js` (`baseURL: "/api"`)
- **Proxy:** Di `vite.config.js`
- Jika ingin memindahkan ke production, ubah `baseURL` di `api.js` atau gunakan proxy reverse di web server.

### 11.3 React 19

Aplikasi menggunakan React 19. Perhatikan:

- `useCallback`, `useMemo`, dan `useRef` sudah stabil
- React Compiler tersedia tetapi belum diaktifkan
- `forwardRef` tidak diperlukan di React 19 untuk penggunaan sederhana

### 11.4 Perbedaan Tema Halaman

Halaman memiliki perbedaan tema:

- **PegawaiIndex:** Tema gelap (`bg-[#161616]`)
- **Halaman lainnya:** Tema terang dengan aksen merah Telkom (`#E2001A`)

### 11.5 Recharts

Library `recharts` tersedia di dependencies tetapi belum digunakan. Library ini siap digunakan untuk pengembangan fitur grafik di masa mendatang.

---

## 12. Kontak

| Peran | Nama | Keterangan |
|-------|------|------------|
| Developer | Ramzy Junfaris Hamonangan | Pengembang utama |
| Pembimbing Lapangan | — | — |

---

*Dokumen ini disusun untuk keperluan serah terima pengembangan aplikasi Sistem Monitoring BBM PT. Telkom Akses Cabang Binjai.*

*Versi: 1.0 — Juli 2026*
