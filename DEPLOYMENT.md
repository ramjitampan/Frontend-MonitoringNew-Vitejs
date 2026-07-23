# Panduan Deployment — Frontend Bensin Monitoring

**PT. Telkom Akses Binjai**

Dokumen ini menjelaskan langkah-langkah untuk menyiapkan, menjalankan, dan men-deploy **frontend** aplikasi Sistem Monitoring BBM.

> **Panduan backend terpisah.** Untuk instalasi, konfigurasi, dan deployment backend (Express.js, Prisma, MariaDB), silakan lihat panduan backend berikut:\
> [github.com/ramjitampan/Backend-MonitoringNew-ExpreesJS/blob/main/DEPLOYMENT.md](https://github.com/ramjitampan/Backend-MonitoringNew-ExpreesJS/blob/main/DEPLOYMENT.md)

---

## Daftar Isi

1. [Persyaratan Sistem](#1-persyaratan-sistem)
2. [Struktur Folder Frontend](#2-struktur-folder-frontend)
3. [Instalasi Frontend](#3-instalasi-frontend)
4. [Konfigurasi Frontend](#4-konfigurasi-frontend)
5. [Menjalankan Development Server](#5-menjalankan-development-server)
6. [Build untuk Production](#6-build-untuk-production)
7. [Deployment Production](#7-deployment-production)
8. [Deployment dengan Nginx](#8-deployment-dengan-nginx)
9. [Troubleshooting](#9-troubleshooting)
10. [Lampiran](#10-lampiran)

---

## 1. Persyaratan Sistem

| Komponen | Versi Minimal        | Keterangan              |
| -------- | -------------------- | ----------------------- |
| Node.js  | 18.x atau lebih baru | Runtime JavaScript      |
| NPM      | 9.x atau lebih baru  | Package manager         |
| RAM      | 2 GB                 | Server production       |
| Storage  | 500 MB               | Aplikasi + dependencies |

### Sistem Operasi yang Didukung

- Windows 10 / 11
- Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+)
- macOS 13+

---

## 2. Struktur Folder Frontend

```
frontend/
├── public/                          # Aset statis
│   ├── favicon.svg
│   ├── icons.svg
│   └── foto/                        # Logo dan gambar
│
├── src/                             # Source code
│   ├── assets/                      # Gambar
│   ├── components/                  # Komponen React
│   │   ├── ui/                      # Komponen UI umum
│   │   ├── Layout.jsx               # Layout utama
│   │   ├── ProtectedRoute.jsx       # Guard autentikasi
│   │   └── DeleteModal.jsx          # Modal hapus
│   ├── contexts/
│   │   └── AuthContext.jsx           # State autentikasi
│   ├── hooks/
│   │   └── useFetch.js              # Custom hook
│   ├── pages/                       # Halaman aplikasi
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── PegawaiIndex.jsx
│   │   ├── PegawaiForm.jsx
│   │   ├── KendaraanIndex.jsx
│   │   ├── KendaraanForm.jsx
│   │   ├── PerjalananIndex.jsx
│   │   └── PerjalananForm.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   └── format.js
│   ├── api.js                       # Axios instance
│   ├── App.jsx                      # Routing
│   ├── App.css
│   ├── index.css                    # Tailwind + custom styles
│   └── main.jsx                     # Entry point
│
├── index.html                       # Entry point HTML
├── vite.config.js                   # Konfigurasi Vite
├── package.json
├── HANDOVER.md                      # Panduan handover
└── DEPLOYMENT.md                    # Dokumen ini
```

---

## 3. Instalasi Frontend

```bash
cd frontend
npm install
```

Tidak ada langkah lain. Seluruh dependensi frontend akan terinstall.

---

## 4. Konfigurasi Frontend

Frontend **tidak memerlukan file `.env`** secara default. Hanya dua hal yang perlu diperhatikan:

### 4.1 API Base URL

File: `src/api.js`

```javascript
const api = axios.create({
  baseURL: "/api", // Development: diproxy Vite ke backend
  headers: { "Content-Type": "application/json" },
});
```

| Lingkungan  | Nilai `baseURL`              | Keterangan                       |
| ----------- | ---------------------------- | -------------------------------- |
| Development | `/api`                       | Diproxy Vite ke `localhost:5000` |
| Production  | `https://api.domain.com/api` | URL backend production           |

Untuk production, ubah `baseURL` sesuai domain backend yang sebenarnya.

### 4.2 Proxy Vite (Development Only)

File: `vite.config.js`

```javascript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",  // Backend dev server
      changeOrigin: true,
    },
  },
}
```

Proxy ini hanya aktif saat `npm run dev`. Untuk production, gunakan Nginx reverse proxy (lihat bagian 8).

---

## 5. Menjalankan Development Server

### 5.1 Prasyarat

Pastikan backend sudah berjalan. Lihat panduan backend:
[github.com/ramjitampan/Backend-MonitoringNew-ExpreesJS/blob/main/DEPLOYMENT.md](https://github.com/ramjitampan/Backend-MonitoringNew-ExpreesJS/blob/main/DEPLOYMENT.md)

### 5.2 Menjalankan Frontend

```bash
cd frontend
npm run dev
```

Server frontend berjalan di `http://localhost:5173`.

Buka browser dan akses `http://localhost:5173`.

---

## 6. Build untuk Production

```bash
cd frontend
npm run build
```

Hasil build berada di folder `frontend/dist/`:

```
dist/
├── index.html
└── assets/
    ├── index-*.css       # CSS terminifikasi
    └── index-*.js        # JavaScript ter-bundle
```

### Preview Build Lokal

```bash
cd frontend
npm run preview
```

Akses di `http://localhost:4173`.

---

## 7. Deployment Production

Ada dua skenario:

### 7.1 Frontend Disajikan oleh Backend

1. **Build frontend:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Salin folder `dist/`** ke folder `public/` backend:

   ```bash
   cp -r frontend/dist/* backend/public/
   ```

3. Backend akan menyajikan file statis dari `public/`.

### 7.2 Frontend & Backend Terpisah

1. **Build frontend:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Upload folder `dist/`** ke server frontend (contoh: `/var/www/bensin-monitoring/`)

3. **Sesuaikan `baseURL`** di `src/api.js` sebelum build (poin 4.1)

4. **Konfigurasi web server** (Nginx — lihat bagian 8)

---

## 8. Deployment dengan Nginx

### 8.1 Konfigurasi Dasar

Buat file `/etc/nginx/sites-available/bensin-monitoring`:

```nginx
server {
    listen 80;
    server_name domain-anda.com;

    root /var/www/bensin-monitoring;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    gzip_min_length 1024;

    # Proxy API ke backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA — semua route diarahkan ke index.html
    location / {
        try_files $uri $uri/ /index.html;

        # Cache file statis
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 8.2 Aktivasi

```bash
sudo ln -s /etc/nginx/sites-available/bensin-monitoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8.3 SSL dengan Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com
```

### 8.4 Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## 9. Troubleshooting

### 9.1 Frontend Tidak Terhubung ke Backend

**Gejala:** Data tidak muncul, error network di console browser.

**Solusi:**

1. Pastikan backend berjalan (cek panduan backend)
2. Cek `baseURL` di `src/api.js` — sudah sesuai environment?
3. Cek konfigurasi proxy Nginx (bagian 8.1) — apakah `proxy_pass` sudah benar?
4. Cek CORS backend

### 9.2 Build Gagal

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

Pastikan Node.js versi 18+:

```bash
node --version
```

### 9.3 Halaman Kosong (White Screen)

- Buka console browser (F12) — cek error JavaScript
- Pastikan routing di `App.jsx` benar
- Pastikan komponen di-export dengan `export default`
- Bersihkan cache browser

### 9.4 Port Sudah Digunakan

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux
lsof -i :5173
kill -9 <PID>
```

Ubah port di `vite.config.js` jika perlu:

```javascript
server: {
  port: 3000,
  proxy: { ... }
}
```

### 9.5 Cache Browser

Gunakan hard refresh: `Ctrl + Shift + R` (Windows/Linux) atau `Cmd + Shift + R` (Mac).

---

## 10. Lampiran

### 10.1 Perintah Cepat

```bash
npm install          # Install dependencies
npm run dev          # Development server (:5173)
npm run build        # Build production (→ dist/)
npm run preview      # Preview build (:4173)
npm run lint         # Linting dengan oxlint
```

### 10.2 Port

| Layanan            | Port | Keterangan         |
| ------------------ | ---- | ------------------ |
| Frontend (dev)     | 5173 | Vite dev server    |
| Frontend (preview) | 4173 | Vite preview build |
| Backend API        | 5000 | Express.js         |

### 10.3 File Penting

| File             | Fungsi                       |
| ---------------- | ---------------------------- |
| `src/api.js`     | Konfigurasi Axios + base URL |
| `vite.config.js` | Proxy, plugin, build config  |
| `src/App.jsx`    | Routing aplikasi             |
| `src/index.css`  | Tailwind CSS + custom styles |
| `index.html`     | Entry point HTML             |

---

_Dokumen ini khusus untuk deployment frontend. Untuk backend, lihat:_\
[KinkOhio_Hamonangan](https://github.com/ramjitampan/Backend-MonitoringNew-ExpreesJS)

_Versi: 1.0 — Juli 2026_
