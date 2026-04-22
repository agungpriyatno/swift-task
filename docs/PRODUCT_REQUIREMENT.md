# **Product Requirement Document (PRD): SwiftTask**

**Versi:** 1.1 (Notifikasi Dinonaktifkan)

**Status:** Draft

**Pemilik Produk:** User & Gemini

## **1\. Pendahuluan**

SwiftTask adalah aplikasi manajemen tugas minimalis yang dirancang untuk pengguna yang membutuhkan kecepatan tinggi dalam mencatat tugas. Fokus utama produk adalah organisasi melalui kategori untuk meminimalisir beban kognitif saat mengelola daftar tugas harian.

## **2\. Tujuan & Sasaran**

* **Kecepatan:** Pengguna dapat masuk dan membuat tugas dalam \< 15 detik.  
* **Organisasi:** Memisahkan beban kerja mental antara kategori personal, profesional, dan lainnya secara visual.  
* **Simpiltas:** Antarmuka bersih tanpa gangguan notifikasi atau fitur yang tidak perlu.

## **3\. Profil Pengguna (User Personas)**

* **Professional Busy-Bee:** Butuh mencatat tugas di sela-sela rapat agar tidak lupa.  
* **The Minimalist:** Tidak menyukai aplikasi yang terlalu banyak tombol dan gangguan eksternal.

## **4\. Persyaratan Fungsional (Functional Requirements)**

### **4.1. Manajemen Autentikasi**

* **ID-01:** Sistem wajib mendukung Login/Sign-up via Google OAuth.  
* **ID-02:** Sistem tidak perlu menyediakan registrasi email/password manual.  
* **ID-03:** Sesi pengguna harus persisten agar tidak perlu login berulang kali.

### **4.2. Manajemen Kategori**

* **ID-04:** Pengguna dapat membuat kategori kustom (Contoh: "Kerja", "Kuliah", "Hobi").  
* **ID-05:** Setiap kategori dapat diberi label warna untuk pembeda visual di dashboard.  
* **ID-06:** Setiap tugas wajib memiliki minimal satu kategori (Default: "Uncategorized").

### **4.3. Manajemen Tugas (Task CRUD)**

* **ID-07:** Pengguna dapat membuat tugas dengan atribut: Judul (Wajib), Deskripsi (Opsional), Kategori (Wajib), Due Date (Opsional).  
* **ID-08:** Pengguna dapat menandai tugas sebagai "Selesai" (Done).  
* **ID-09:** Tugas yang sudah selesai akan dipindahkan ke bagian "Completed" atau diarsipkan secara otomatis.

## **5\. Persyaratan Non-Fungsional**

* **Security:** Data pengguna harus terisolasi; user A tidak boleh bisa melihat kategori/tugas user B.  
* **Performance:** Loading dashboard utama tidak boleh lebih dari 1.5 detik (Fokus pada kecepatan karena tidak ada overhead notifikasi).  
* **Simplicity:** UI harus mengikuti prinsip *minimalist design*.

## **6\. User Flow (Alur Pengguna)**

1. **Landing:** User klik "Login with Google".  
2. **Dashboard:** User melihat daftar tugas hari ini yang dikelompokkan per kategori.  
3. **Add Task:** User mengetik judul, memilih kategori via dropdown cepat, dan opsional set tanggal.  
4. **Action:** User kembali ke aplikasi dan mencentang tugas sebagai "Done".

## **7\. Kriteria Penerimaan (Acceptance Criteria)**

* Pengguna berhasil login tanpa input password.  
* Perpindahan antar kategori di dashboard berlangsung secara instan (\< 300ms).  
* Kategori yang dihapus akan memindahkan tugas terkait ke "Uncategorized".

## **8\. Analisis Risiko**

| Risiko | Mitigasi |
| :---- | :---- |
| Pengguna lupa kategori | Menyediakan tombol "Quick Add Category" langsung di modal pembuatan tugas. |
| Timezone mismatch | Semua waktu disimpan dalam UTC dan dikonversi ke timezone lokal user di Frontend. |

