import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

// Mengambil DATABASE_URL dari environment
const connectionString = `${process.env.DATABASE_URL}`;

// Membuat pool koneksi menggunakan pg
const pool = new Pool({ connectionString });

// Membuat instance dari PrismaPg adapter
const adapter = new PrismaPg(pool);

// Inisialisasi Prisma Client dengan adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
