import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Mengecek sesi secara langsung di sisi server Node.js runtime
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Jika tidak ada sesi aktif, redirect ke halaman login/utama
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
