# **User Stories & Acceptance Criteria: SwiftTask**

**Proyek:** SwiftTask (Minimalist Task Manager)

**Versi:** 1.0

**Status:** Ready for Development

## **Epic 1: Autentikasi & Akses (Authentication)**

### **US-01: Google OAuth Login**

**Sebagai** pengguna yang sibuk,

**Saya ingin** masuk ke aplikasi menggunakan akun Google,

**Sehingga** saya tidak perlu mengingat kata sandi baru atau mengisi formulir pendaftaran yang panjang.

**Acceptance Criteria:**

1. Sistem menampilkan tombol "Login with Google" yang menonjol di halaman landing.  
2. Sistem mengarahkan pengguna ke alur standar Google OAuth 2.0.  
3. Setelah login berhasil, jika pengguna baru, sistem otomatis membuatkan profil berdasarkan data Google (Nama, Email, Foto Profil).  
4. Sesi pengguna tetap aktif (persistent) bahkan setelah browser ditutup, hingga pengguna melakukan logout secara manual.  
5. Sistem tidak menyediakan opsi pendaftaran manual melalui email/password (sesuai ID-02).

## **Epic 2: Manajemen Kategori (Category Management)**

### **US-02: Membuat Kategori Kustom**

**Sebagai** pengguna yang terorganisir,

**Saya ingin** membuat kategori tugas dengan nama dan warna tertentu,

**Sehingga** saya bisa membedakan beban kerja mental saya secara visual.

**Acceptance Criteria:**

1. Pengguna dapat mengakses menu "Add Category" dari dashboard atau modal pembuatan tugas.  
2. Input kategori wajib menyertakan Nama Kategori.  
3. Sistem menyediakan palet warna (color picker) untuk dipilih sebagai label visual kategori.  
4. Kategori yang baru dibuat langsung tersedia di dropdown pilihan saat membuat tugas.  
5. Sistem secara otomatis menyediakan kategori default bernama "Uncategorized".

### **US-03: Penghapusan Kategori**

**Sebagai** pengguna,

**Saya ingin** menghapus kategori yang sudah tidak relevan,

**Tanpa** kehilangan tugas-tugas yang ada di dalamnya.

**Acceptance Criteria:**

1. Terdapat opsi "Delete" pada setiap kategori kustom.  
2. Sistem menampilkan konfirmasi sebelum penghapusan.  
3. **Logika Data:** Semua tugas yang terkait dengan kategori yang dihapus secara otomatis dipindahkan ke kategori "Uncategorized" (sesuai kriteria penerimaan PRD).

## **Epic 3: Manajemen Tugas (Task CRUD)**

### **US-04: Pembuatan Tugas Cepat (Quick Add Task)**

**Sebagai** pengguna yang sedang terburu-buru,

**Saya ingin** membuat tugas baru dalam waktu kurang dari 15 detik,

**Sehingga** saya bisa segera kembali ke aktivitas utama saya.

**Acceptance Criteria:**

1. Input "Judul Tugas" bersifat wajib (mandatory).  
2. Input "Deskripsi" bersifat opsional.  
3. "Kategori" bersifat wajib, dengan pilihan default ke kategori terakhir yang digunakan atau "Uncategorized".  
4. "Due Date" bersifat opsional dan menggunakan komponen kalender yang minimalis.  
5. Sistem memberikan konfirmasi visual singkat bahwa tugas berhasil disimpan.

### **US-05: Dashboard & Filter Tugas**

**Sebagai** pengguna,

**Saya ingin** melihat daftar tugas yang dikelompokkan berdasarkan kategori di dashboard,

**Sehingga** saya memiliki gambaran jelas tentang prioritas hari ini.

**Acceptance Criteria:**

1. Halaman utama menampilkan daftar tugas yang aktif (belum selesai).  
2. Tugas dikelompokkan secara visual berdasarkan kategori dan warna labelnya.  
3. Loading dashboard harus di bawah 1.5 detik (Performance requirement).  
4. Perpindahan filter antar kategori harus instan (\< 300ms).

### **US-06: Penyelesaian Tugas (Mark as Done)**

**Sebagai** pengguna,

**Saya ingin** menandai tugas sebagai selesai dengan satu klik,

**Sehingga** daftar tugas saya tetap bersih dan terfokus.

**Acceptance Criteria:**

1. Setiap item tugas memiliki checkbox atau area klik untuk menandai "Done".  
2. Saat dicentang, tugas secara otomatis dipindahkan dari daftar utama ke bagian "Completed" atau diarsipkan (sesuai ID-09).  
3. Tersedia opsi untuk membatalkan status selesai (undo/uncheck) jika terjadi kesalahan klik.

## **Epic 4: Persyaratan Non-Fungsional & Keamanan**

### **US-07: Isolasi Data & Privasi**

**Sebagai** pengguna,

**Saya ingin** data saya aman dan tidak dapat diakses orang lain,

**Sehingga** saya bisa mencatat hal-hal personal dengan tenang.

**Acceptance Criteria:**

1. Sistem memastikan User A hanya bisa melihat, mengedit, atau menghapus kategori dan tugas miliknya sendiri.  
2. API request harus memvalidasi token sesi pengguna untuk setiap operasi CRUD.

### **US-08: Penanganan Waktu (Timezone)**

**Sebagai** pengguna yang sering berpindah lokasi,

**Saya ingin** tenggat waktu tugas disesuaikan dengan waktu lokal saya,

**Sehingga** saya tidak melewatkan tugas penting.

**Acceptance Criteria:**

1. Sistem menyimpan semua timestamp di database dalam format UTC.  
2. Frontend secara otomatis mengonversi UTC tersebut ke zona waktu lokal di perangkat pengguna saat ditampilkan.