# DailyFlow
| Nama                          | NRP        |
|-------------------------------|------------|
| I Gede Bagus Saka Sinatrya    | 5027241088 |

# DailyFlow – Personal Productivity, Expense Tracking & Task Management System
DailyFlow adalah aplikasi web modern yang membantu pengguna mengelola pengeluaran, tugas harian, serta aktivitas produktivitas dalam satu platform terintegrasi. Aplikasi ini menggabungkan frontend interaktif (Next.js + React) dengan backend API (Node.js + Express + MongoDB), menjadikannya sistem manajemen produktivitas yang lengkap, responsif, dan mudah digunakan.

DailyFlow menyediakan dua fitur utama:
- Expense Tracker, yang memungkinkan pengguna mencatat, memvisualisasikan, dan memahami pola keuangan harian secara jelas dan terstruktur.
- Task Manager / To-Do List, yang memudahkan pengguna mengatur tugas, memprioritaskan kegiatan, serta melacak progres harian dengan lebih efektif.

Dengan integrasi penuh antara backend dan frontend, DailyFlow menjadi pusat kendali harian yang membantu pengguna tetap terorganisir, produktif, dan sadar terhadap kondisi finansialnya.

---

## 🎯 Problem Statement 

### To do List
Dalam aktivitas harian, banyak pengguna menghadapi masalah seperti:

* **Tugas yang tercecer** antara catatan, screenshot, WhatsApp, dan file lokal.
* **Kesulitan memantau progres** karena tidak ada dashboard terpadu.
* **Tidak ada integrasi antara aktivitas harian dengan data profil pengguna.**
* **Keterbatasan aplikasi to-do list biasa**, seperti tidak mendukung upload file atau kategori khusus.
  
### Expense Tracker
Dalam aktivitas harian, banyak pengguna menghadapi masalah dalam mencatat pengeluaran seperti:

* Banyak pengguna tidak memiliki catatan pengeluaran yang terpusat.
* Data pengeluaran sering tersebar di chat, catatan, atau hanya mengandalkan ingatan.
* Tidak ada rekap atau grafik sehingga sulit melihat pola pengeluaran.
* Pengguna sering melewati budget karena tidak ada pemantauan rutin.
* Pengeluaran kecil sering terlupakan dan tidak tercatat. 

DailyFlow diciptakan untuk menjawab tantangan-tantangan tersebut dengan menyediakan sistem yang rapi, terpusat, dan mudah digunakan.

---

## 🚀 Solution Overview

DailyFlow menawarkan pengalaman produktivitas menyeluruh melalui fitur-fitur berikut:

###  **Task Management**

* Tambah tugas baru beserta prioritas
* Tandai tugas selesai / penting
* Kelompokkan berdasarkan kategori
* Upload file yang terkait tugas

### **Expense Tracking**

* Tambah pengeluaran harian
* Kategori pengeluaran
* Grafik pengeluaran pendidikan, kebutuhan, hiburan, dll.
* Dashboard overview pengeluaran bulanan

### **User Profile Management**

* Update nama, email
* Upload foto profil

### **Dashboard Analytics**

* Visualisasi grafik tugas & pengeluaran
* Status progres harian
* Peringatan aktivitas

### **File Upload System**

* Upload gambar (PNG, JPG)
* Semua file disimpan aman di backend

---

## Tech Stack

### **Frontend**

* Next.js / React.js
* Axios
* Tailwind / CSS Modules
* Context API Authentication
* lucide-react icons

### **Backend**

* Node.js (Express.js)
* JWT Authentication
* Mongoose ODM

### **Database**

* MongoDB Compass

---

## 📦 Fitur Utama

### **Authentication**

* Register
* Login
* JWT-based Auth
* Protected Routes (Frontend + Backend)

### **Tasks Module**

* CRUD Tugas
* Prioritas (High/Medium/Low)
* Status: Completed / Pending
* Upload Lampiran

### **Expense Module**

* CRUD Pengeluaran
* Kategori & Deskripsi
* Grafik Visualisasi Pengeluaran

### **Profile Module**

* Update profil
* Ubah foto
* Validasi email & input

---


## ⚙️ Cara Menjalankan Project (Development Setup)

---

# 1. Setup Backend

Masuk ke folder backend:

```
cd backend
npm install
```

### Buat file `.env`:

```
PORT=5000
MONGO_URI=your_mongo_atlas_url
JWT_SECRET=your_jwt_secret
```

### Buat folder untuk upload file:

```
/backend/uploads
```

### Jalankan server:

```
npm run dev
```

Backend berjalan di:

```
http://localhost:5000
```

---

# 2. Setup Frontend

Masuk ke folder frontend:

```
cd frontend
npm install
```

### Buat file `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Jalankan frontend:

```
npm run dev
```

Aplikasi berjalan di:

```
http://localhost:3000
```

---

# Dokumentasi 

## Login
<img width="2865" height="1543" alt="Image" src="https://github.com/user-attachments/assets/14e7d746-49e7-4068-af02-37247170aed4" />

## Dashboard
<img width="2868" height="1547" alt="Image" src="https://github.com/user-attachments/assets/6d4fccbd-280f-4fa1-8204-63c090a89e25" />

## Dasboard Dark Mode
<img width="2866" height="1548" alt="Image" src="https://github.com/user-attachments/assets/12843919-e5b1-40f3-96d6-e52fce4dfa02" />

## Tambah Pengeluaran
<img width="2868" height="1550" alt="Image" src="https://github.com/user-attachments/assets/a8c1208c-2ae3-4010-b865-80d418fe029d" />

## Lihat Pengeluaran
<img width="2878" height="1550" alt="Image" src="https://github.com/user-attachments/assets/e6ede2b9-1f70-4d5e-8e0b-1c272e46acd6" />

## Ringkasan Pengeluaran
<img width="2857" height="1546" alt="Image" src="https://github.com/user-attachments/assets/1ef663b5-e95f-4377-901b-0354ea4b6875" />

## Tambah Tugas
<img width="2870" height="1550" alt="Image" src="https://github.com/user-attachments/assets/0f33686f-1235-4c33-bc99-cb5448267e1d" />

## Tugas Hari ini
<img width="2871" height="1549" alt="Image" src="https://github.com/user-attachments/assets/1cc98fa2-a9d8-453e-a149-7412aca3549e" />

## Lihat Tugas Mingguan
<img width="2864" height="1548" alt="Image" src="https://github.com/user-attachments/assets/5d055552-2c72-4a31-9371-c782d5600da5" />

