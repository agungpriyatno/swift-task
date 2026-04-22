# **Technical Design Specification: SwiftTask (Minimalist Task Manager)**

## **1\. Executive Summary**

Dokumen ini merinci arsitektur teknis untuk **SwiftTask**, aplikasi manajemen tugas minimalis. Arsitektur ini mengutamakan performa tinggi menggunakan runtime **Bun**, keamanan isolasi data pengguna, dan pengalaman pengguna yang responsif melalui integrasi _Server Components_ dan _Server Actions_ pada Next.js.

## **2\. Tech Stack Overview**

| Layer                   | Technology             | implementation Details                                                 |
| :---------------------- | :--------------------- | :--------------------------------------------------------------------- |
| **Runtime**             | Bun                    | Digunakan untuk eksekusi server-side yang cepat dan manajemen paket.   |
| **Fullstack Framework** | Next.js (App Router)   | Pendekatan _Server Component First_ untuk efisiensi loading data.      |
| **Database**            | PostgreSQL (Supabase)  | Relational database dengan skalabilitas tinggi.                        |
| **ORM**                 | Prisma                 | Type-safe database access dan skema terpusat.                          |
| **Authentication**      | Better Auth            | Penanganan Google OAuth dengan sinkronisasi session yang mudah.        |
| **Validation**          | Zod                    | Single source of truth untuk validasi di client, server, dan database. |
| **UI & Styling**        | Shadcn/UI \+ Tailwind  | Component library untuk pembangunan UI yang konsisten dan cepat.       |
| **State Management**    | nuqs & React Hook Form | Manajemen query parameters (filtering) dan form handling yang efisien. |

## **3\. Database Schema (Prisma)**

Desain skema difokuskan pada relasi satu-ke-banyak antara User, Kategori, dan Tugas, dengan mekanisme _cascading_ untuk keamanan data.

datasource db {  
 provider \= "postgresql"  
 url \= env("DATABASE_URL")  
}

generator client {  
 provider \= "prisma-client-js"  
}

model User {  
 id String @id @default(cuid())  
 email String @unique  
 name String?  
 image String?  
 tasks Task\[\]  
 categories Category\[\]  
 createdAt DateTime @default(now())  
 updatedAt DateTime @updatedAt  
}

model Category {  
 id String @id @default(cuid())  
 name String  
 color String @default("\#808080")  
 userId String  
 user User @relation(fields: \[userId\], references: id, onDelete: Cascade)  
 tasks Task\[\]  
 createdAt DateTime @default(now())  
 updatedAt DateTime @updatedAt

@@index(\[userId\])  
}

model Task {  
 id String @id @default(cuid())  
 title String  
 description String? @db.Text  
 isCompleted Boolean @default(false)  
 dueDate DateTime?  
 userId String  
 user User @relation(fields: \[userId\], references: id, onDelete: Cascade)  
 categoryId String  
 category Category @relation(fields: \[categoryId\], references: id)  
 createdAt DateTime @default(now())  
 updatedAt DateTime @updatedAt

@@index(\[userId\])  
 @@index(\[categoryId\])  
}

## **4\. Architecture Implementation**

### **A. Authentication Flow (Better Auth)**

- **Provider**: Google OAuth 2.0.
- **Client Side**: Menggunakan authClient dari Better Auth untuk memicu proses login.
- **Server Side**: Middleware memeriksa session cookie untuk setiap request Server Action atau akses halaman dashboard.
- **User Provisioning**: Jika email belum terdaftar di database, Better Auth secara otomatis membuat entitas User baru di PostgreSQL.

### **B. Data Fetching (Server Components)**

- Dashboard utama (/dashboard) menggunakan React Server Components untuk mengambil data langsung via Prisma.
- **Filtering**: Menggunakan library nuqs untuk sinkronisasi state filter (kategori, status tugas) dengan URL query parameters.
- **Performance**: Memanfaatkan _Streaming_ dengan Suspense untuk menampilkan kerangka (skeleton) Shadcn saat data sedang dimuat.

### **C. Mutations (Server Actions)**

- **Create Task**: Form dikelola oleh react-hook-form dengan validasi zod. Saat disubmit, memanggil Server Action yang menjalankan prisma.task.create.
- **Mark as Done**: Menggunakan useOptimistic hook dari React untuk memberikan feedback instan (checkbox langsung tercentang) sebelum database selesai diperbarui.
- **Category Deletion**: Sesuai US-03, logic di NestJS/Server Action akan melakukan _batch update_ untuk mengubah categoryId tugas yang terdampak menjadi ID kategori "Uncategorized" sebelum menghapus kategori target.

## **5\. API & Server Action Design**

| Action / Endpoint | Logic                                            | Validation (Zod)                     |
| :---------------- | :----------------------------------------------- | :----------------------------------- |
| createTaskAction  | Insert task ke DB berdasarkan userId di session. | title (min 1), categoryId (required) |
| toggleTaskStatus  | Update isCompleted berdasarkan taskId.           | taskId (uuid/cuid)                   |
| createCategory    | Insert kategori baru dengan kode warna hex.      | name (required), color (hex regex)   |
| deleteCategory    | Remap tugas ke "Uncategorized" & hapus kategori. | categoryId (required)                |

## **6\. Non-Functional Requirements & Security**

1. **Data Isolation**: Setiap query Prisma wajib menyertakan filter { userId: session.user.id } untuk mencegah akses data lintas pengguna.
2. **Timezone Handling**:
   - Input dueDate dikonversi ke UTC di sisi client sebelum dikirim.
   - Penyimpanan di PostgreSQL menggunakan format Timestamp with time zone.
   - Frontend menampilkan waktu menggunakan format lokal user via Intl.DateTimeFormat.
3. **UI Performance**: Implementasi Shadcn dilakukan secara modular untuk menjaga ukuran bundle tetap kecil. Transisi antar filter kategori harus di bawah ![][image1].

## **7\. Folder Structure (Recommended)**

src/  
├── app/ \# Next.js App Router (Pages, Layouts, Server Actions)  
├── components/ \# Shadcn UI Components & Shared Layouts  
├── hooks/ \# Custom hooks (nuqs, useOptimistic)  
├── lib/ \# Prisma Client, Better Auth Config, Zod Schemas  
├── services/ \# NestJS Logic / Business Services  
└── types/ \# TypeScript Definitions

[image1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAYCAYAAABeIWWlAAAD20lEQVR4Xu2Wa4hVVRTHr2PaRGFoXkfnde48RGesCEc/FD1UIvNVKgQDvkDRQoqIEFQsBCOI6K2gkuUwE86IWtiYooKYMwPq4LsixZT8YMpg0JBDSOjvP2ftYc2Z+/nih7tgsff67f/ee61z9nmkUnnL2/1rURTNwE+Xl5cfpW2lfQtckNTBFzG+H+/IZDI7KyoqoqQGPprxbfgR9Mfx5UlNzoxkniKRtsrKykcV05+G38W/8jrilfiZqqqqUYpJ+n3iv0IsKy4uHsl656RVzFgZ/Uuw9UGTU2PzjSqGBOoNDSLuxm+n0+lHBLhDRcQ9FPSam1oAu4avCoD+JyrOaXTx3oB31dXVDfE8J8bGG/D/8fmGVNx/KjgUR3+ZYop80k0VP0zBB1x8lWJaEprek1BWVvac5zkzHZ/Qt2N6V4kHFtnd9Trje/Bu5hTas6YTsMVrKL7O1lvnec5Nzx3J7SWRk9XV1enAib+3xEd7PYk3212pwidZERu9prS09AlxtN96nlMj8dUkcRa/TX9KYuxgtuJg31lBNYy9kK04iqo13qRYa9PfhXeocOLpIcY70VfiE+ANxD/hh7hwr/g1g9kF3ScNfox5c5KafoZogSWz1LFWsSzFNYmT5Fjap21ev+KIa2xuQ1FR0cP02/Vyob1MMn/SvolskGnP46d0tFnzITH1YVf9msbHw6+HE0Z/Lf5LUjfAEJ3Ee7SAxY1KEB+T0O0QLykpeYyXzTjTbPIaru7j4hTyGe0s1lyjhIxt9tooLq6T8Qcd2xRlKQ62Cv83XHDad/C5/UQkVpol6W9s8w8VM+lzS7zC6xj/QZxugb5xptnmNRQ32fh7gbFevbFnArNvoti7gaXiN7fu8IDnFfai6eW/seZH0vcJVDUDd/AeJee4zrsmfWrxEosn9k1O9V6ENrw9xGx4kXh3QqO/H82d6dhW/BbdBxxbKp3/3BBPFWP/VwPzZmt/oBxsjwV9g0zKGPzb/2mAf/aLkvRw4n9oFwdNbW3tUFgX7O3AbKPfU+4KRvHxue4/4sR/MK85xMZ0Wq5kYV3ai1xex18W19xM4mcB3S34Is9USAsDX6fsKiJYocJ05FLu/xLdXHgH3cGmW058Gl7oNIWwdmkV66Wgu4kvDBr6E7Q+viwwGfG1TOIbCfsV1qBPlO3dm6MKjuxUybjbzxO38awO65ss08PLAl8weIP2RBS/UlekrAhvLPIS4x9H8QvmS5IfkdSIsc5q1tgexcdvnh/PxJ+CC/6kaA7sJnOeTWjry+Of+Ua9kQOHzY7iT8CPls+G8G+ct7zlLW95y5vZPZzaPlT0OHpwAAAAAElFTkSuQmCC
