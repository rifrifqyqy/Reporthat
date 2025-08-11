
# Reporthat

**Reporthat** adalah aplikasi web full-stack yang dirancang untuk memberdayakan masyarakat dalam melaporkan kerusakan fasilitas umum atau lingkungan secara cepat dan mudah. Pengguna dapat mengirimkan laporan lengkap dengan gambar dan lokasi geografis, sementara admin dapat mengelola dan melacak status setiap laporan hingga terselesaikan.


## Demo

Live Demo: https://reporthat.vercel.app/


## ✨ Fitur Utama

- **Otentikasi Pengguna:** Sistem registrasi dan login yang aman menggunakan Supabase Auth.
- **Pelaporan Berbasis Geografis:** Pengguna dapat menandai lokasi kerusakan secara akurat menggunakan peta interaktif (Leaflet.js).
- **Unggah Gambar:** Setiap laporan dapat disertai dengan beberapa gambar sebagai bukti visual.
- **Dashboard Admin:** Halaman khusus untuk admin melihat, mengelola, dan memperbarui status semua laporan yang masuk.
- **Manajemen Status Laporan:** Admin dapat mengubah status laporan (PENDING, REVIEWING, RESOLVED).
- **Operasi CRUD:** Fungsionalitas penuh untuk Create, Read, Update, dan Delete laporan.
- **Antarmuka Modern & Responsif:** Dibangun dengan Svelte 5 dan Tailwind CSS, dengan animasi yang menarik menggunakan GSAP untuk pengalaman pengguna yang lebih baik.


## 🛠️ Tech Stack

- **Framework:** SvelteKit & Svelte 5

- **Backend & Database:** Supabase (PostgreSQL + Auth)

- **ORM:** Prisma

- **Styling:** Tailwind CSS dengan prettier-plugin-tailwindcss

- **Komponen UI:** shadcn-svelte

- **Animasi:** GSAP (GreenSock Animation Platform) & Transisi Svelte

- **Peta:** Leaflet.js

- **Validasi Skema:** Zod

- **Deployment:** Vercel


## 🌊 Alur Program (Application Flow)

 **1. Pengguna Baru & Otentikasi:**
- Pengguna mengunjungi landing page yang menjelaskan tujuan aplikasi.
- Pengguna mendaftar atau login melalui sistem otentikasi yang dikelola oleh Supabase Auth.
- Informasi pengguna disimpan di tabel auth.users dan public.profiles.

**2. Pembuatan Laporan:**
- Setelah login, pengguna dapat membuat laporan baru.
- Frontend mengirimkan request POST ke endpoint /api/reports.
- Endpoint ini menerima data (judul, deskripsi, gambar, lokasi) dan menggunakan prisma.reports.create() untuk menyimpannya ke database di skema public.
- Setiap laporan secara otomatis terhubung dengan user_id pelapor.

**3. Manajemen Laporan (Admin Dashboard):**
- Admin mengunjungi halaman /dashboard.
- Halaman ini memanggil endpoint GET /api/reports untuk mengambil semua data laporan, termasuk informasi pelapor melalui relasi Prisma.
- Admin dapat melakukan dua aksi utama:
    - Update Status: Mengubah status laporan melalui dropdown akan memicu request PUT ke /api/reports/[id]. Backend akan memvalidasi dan memperbarui status di database.
    - Hapus Laporan: Menekan tombol delete akan memicu request DELETE ke /api/reports/[id], yang akan menghapus laporan dari database.



## 🔌 Endpoint API

```http
  GET /api/reports
```

- **Metode:** GET
- **Deskripsi:** Mengambil semua laporan dari database, diurutkan dari yang terbaru. Juga menyertakan data pengguna yang terkait.
- **Respons Sukses:** { success: true, reports: [...] }


```http
  POST /api/reports
```

- **Metode:** POST
- **Deskripsi:** Membuat laporan baru.
- **Body Request:** { title, description, images, lat, lng, user_id }
- **Respons Sukses:** { success: true, reports: [...] }

```http
  PUT /api/reports/${id}
```

- **Metode:** PUT
- **Deskripsi:** Memperbarui status laporan tertentu.
- **Body Request:** { status: "REVIEWING" | "RESOLVED" }
- **Respons Sukses:** { success: true, reports: [...] }

```http
  DELETE /api/reports/${id}
```

- **Metode:** DELETE
- **Deskripsi:** Menghapus laporan tertentu.
- **Respons Sukses:** { success: true, message: "Laporan berhasil dihapus." }


## 🚀 Menjalankan Project Secara Lokal

Untuk menjalankan proyek ini di lokal Anda, ikuti langkah-langkah berikut:

**1. Clone Repository**

```bash
  git clone https://github.com/rifrifqyqy/Reporthat.git
  cd Reporthat
```

**2. Install Dependencies**

```bash
  npm install
```

**3. Setup Environment Variables**
- Buat file .env di root proyek.
- Salin isi dari .env atau tambahkan variabel berikut. Anda bisa mendapatkannya dari Supabase dan database PostgreSQL Anda.

```bash
  # URL koneksi database dari Supabase untuk Prisma
  DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"
  DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:6543/postgres"
  
  # Kunci API dari Supabase untuk otentikasi di sisi klien
  PUBLIC_SUPABASE_URL="https://your-project-url.supabase.co"
  PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**4. Jalankan Migrasi Database**
- Perintah ini akan menyinkronkan schema.prisma dengan database Anda.

```bash
  npx prisma migrate dev
```

**5. Jalankan Development Server**

```bash
  npm run dev
```
    