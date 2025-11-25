# 💡 Vibe Coding Week — Problem Solving App  
**Stack:** React.js + Express.js + MongoDB  


## 🎯 Tujuan  
Buat **aplikasi web sederhana** yang membantu **menyelesaikan masalah nyata** di sekitar kamu — bukan sekadar CRUD, tapi solusi yang punya dampak.  
Kamu bebas memilih topik, asalkan sesuai tema *problem solving*.

---

## 🧠 Tema Utama: “Solve a Real Problem”
Pilih satu masalah nyata yang sering kamu temui di lingkungan sekitar (kampus, rumah, komunitas, bisnis kecil, dll).  
Lalu, buat aplikasi yang bisa membantu memecahkan masalah tersebut secara digital.

---

### 💬 Contoh Ide
- 🏫 Laporan fasilitas rusak di kampus  
- 🧾 Catatan dan analisis pengeluaran pribadi  
- 🗓️ Pengingat kegiatan komunitas  
- 🍽️ Pemesanan makanan kantin online  

---

## ⚙️ Minimum Fitur Wajib

### 1️⃣ Authentication  
- Register dan Login user (JWT).  
- Password di-hash (bcrypt).  
- Simpan token di localStorage / session.

### 2️⃣ CRUD Data Utama  
- Minimal **1 entitas utama** (contoh: Task, Product, Report, Event, Book, dll).  
- Fitur: **Create**, **Read**, **Update**, **Delete**.  
- Data tersimpan di MongoDB.

### 3️⃣ Upload File / Gambar  
- Upload file (foto, dokumen, dsb) dari frontend ke backend.  
- Tampilkan hasil upload di UI.

### 4️⃣ Frontend React  
- Minimal 3 halaman:
  - Login/Register  
  - Dashboard/List Data  
  - Form Tambah/Edit / Detail Data  
- Gunakan React Router & Axios/Fetch untuk API.  
- Responsif (mobile & desktop).  

---

## ⚡ Bonus (Opsional)
- Deployment ke **Vercel/Netlify** (frontend) dan **Render/Railway** (backend) atau cloud service lainnya (tips : manfaatkan github student package untuk free domain dan server).

---

## 📦 Output Akhir
- Aplikasi fungsional berbasis **React + Express + MongoDB**.  
- Repo GitHub (frontend & backend).  
- Link demo (jika deploy).  

### 📝 README Kamu Harus Berisi:
1. **Judul Proyek & Deskripsi Singkat**  
2. **Masalah yang Diselesaikan (Problem Statement)**  
3. **Solusi yang Dibuat (Solution Overview)**  
4. **Tech Stack & Fitur Utama**  
5. **Cara Menjalankan Project (Setup Instructions)**  

---

## 🏆 Kompetisi : 3 aplikasi terbaik akan mendapatkan **hadiah topup E-Wallet sebesar 50k**

| No | Kategori | Bobot | Kriteria Penilaian |
|----|-----------|--------|--------------------|
| **1** | 💡 **Problem & Solution Fit** | **25%** | - Relevansi masalah yang diangkat. <br> - Kejelasan solusi yang ditawarkan. <br> - Dampak potensial terhadap pengguna atau lingkungan. |
| **2** | 🧠 **Kreativitas & Inovasi** | **15%** | - Keunikan ide dan cara penyelesaian masalah. <br> - Pendekatan solusi yang tidak umum atau inovatif. |
| **3** | ⚙️ **Fungsionalitas Teknis (Backend)** | **20%** | - Implementasi fitur CRUD & autentikasi berjalan dengan baik. <br> - Integrasi database MongoDB benar dan stabil. <br> - Struktur kode backend rapi dan modular (router, controller, model). |
| **4** | 💻 **Fungsionalitas Teknis (Frontend)** | **20%** | - React app berfungsi dengan baik (routing, state management, API). <br> - Error handling & UX dasar terpenuhi. <br> - Komponen reusable & konsistensi desain. |
| **5** | 🎨 **Desain & Pengalaman Pengguna (UI/UX)** | **10%** | - Antarmuka menarik dan mudah digunakan. <br> - Responsif di perangkat mobile/desktop. <br> - Warna & layout konsisten. |
| **6** | 🚀 **Dokumentasi** | **10%** | - README lengkap (problem, solusi, fitur, cara menjalankan). <br> - Demo/deployment berfungsi (jika ada). <br> - Penjelasan ide & fitur saat presentasi jelas. |

---

🎯 NAMA PROYEK
DailyFlow – Aplikasi Manajemen Keuangan & Aktivitas Harian Berbasis Web

## 🌟 1. TUJUAN APLIKASI
DailyFlow adalah aplikasi full-stack yang membantu pengguna:
1.	Melacak pengeluaran harian/mingguan/bulanan

2.	Mengatur dan memantau tugas atau kegiatan harian (to-do list)

3.	Melihat rangkuman aktivitas melalui dashboard

4.	Membangun kebiasaan produktif & finansial yang sehat

Aplikasi ini dibangun menggunakan:
●	Frontend: React + TypeScript (Vite)

●	Backend: Node.js + Express

●	Database: MongoDB + Mongoose

●	Auth: JWT Authentication


## 🧩 2. FITUR UTAMA
A. Authentication & User System
●	Register

●	Login

●	Logout

●	Middleware proteksi halaman

●	Penyimpanan token JWT

●	Halaman “Profile” + informasi dasar user


## B. Expense Tracker
Fiturnya meliputi:
1. Add Expense
●	Nominal

●	Kategori (Food, Transport, Bills, dan yang lainnya.)

●	Tanggal

●	Catatan opsional

2. Manage Expenses
●	Menampilkan semua pengeluaran per user

●	Filter by:

○	Tanggal

○	Kategori

○	Range nominal

●	Sorting table (ASC/DESC)

●	Edit & Delete pengeluaran

3. Expense Summary
●	Total harian

●	Total mingguan

●	Total bulanan

●	Grafik:

○	Pie chart distribusi kategori

○	Line chart pengeluaran mingguan


## C. To-Do List Tracker
Fitur meliputi:
1. Add Task
●	Nama tugas

●	Kategori (kuliah, kerja, lifestyle, dan lainnya)

●	Deadline tanggal

●	Prioritas opsional

2. Today's Tasks
●	Checklist tugas hari ini

●	Status:

○	Pending

○	Done

●	Progress bar otomatis

3. Weekly Tasks View
●	Kalender mingguan

●	Statistik:

○	Total tugas per hari

○	Berapa yang selesai

○	Warna indikator (merah/kuning/hijau)


## D. Dashboard
Saat user login, mereka masuk ke halaman:
Dashboard berisi ringkasan:
Expense Summary hari ini
●	Total pengeluaran hari ini

●	Total minggu ini

●	Pengeluaran terbanyak per kategori

To-do Summary hari ini
●	Total tugas hari ini

●	Berapa yang sudah selesai

●	Progress chart (circular)


## E. UI/UX dengan Sidebar Navigation
Navbar akan tampil setelah login:
Dashboard
Expense Tracker
  - Add Expense
  - View Expenses
  - Summary
To-Do List
  - Add Task
  - Today's Tasks
  - Weekly Tasks
Logout


## 🛠 3. ARSITEKTUR SISTEM
Frontend: React + TS
●	Routing: React Router

●	Global state: Context API

●	HTTP request: Axios

●	Protected route component

●	Component-based architecture


## Backend: Node.js + Express
Mongo db

## 🧭 5. USER FLOW (ALUR PENGGUNAAN)
1. User membuka web → masuk halaman login / register
2. User login → token disimpan → redirect ke Dashboard
3. User dapat memilih:
●	Tambah pengeluaran

●	Lihat pengeluaran

●	Lihat grafik

●	Tambah tugas

●	Cek to-do hari ini

●	Lihat tugas mingguan

4. Semua data tersimpan per user
5. User bisa logout

## 🎨 6. Tampilan UI (Konsep Visual)
Warna utama:
●	Biru soft

●	Putih

●	Abu-abu lembut

Style:
●	Modern minimalis

●	Komponen modular

●	Smooth hover & elevation

●	Chart.js untuk grafik

Halaman:
✔ Login/Register
 ✔ Dashboard
 ✔ Expense Pages
 ✔ To-Do Pages
 ✔ Settings

## 🚀 7. Kelebihan Aplikasi Ini
●	Full-stack lengkap (Auth + CRUD + grafik + API)

●	Cocok sebagai proyek besar PWEB/Pemrograman Web

●	Bisa dikembangkan ke:

○	PWA (mobile)

○	Ekspor PDF

○	Sistem budgeting

○	Notifikasi


## 📌 8. Kesimpulan Konsep Final
DailyFlow adalah aplikasi web yang modern, responsif, dan fungsional yang membantu user menggabungkan manajemen keuangan + manajemen aktivitas dalam satu platform dengan:
✔ React (frontend)
 ✔ Express (backend)
 ✔ MongoDB (database)
 ✔ JWT auth
 ✔ Dashboard informatif
 ✔ Grafik keuangan
 ✔ To-do list lengkap
 ✔ UI profesional dengan sidebar


