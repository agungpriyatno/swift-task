import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/login-button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="flex-1 flex flex-col items-center justify-center p-8 sm:p-24 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
          SwiftTask
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl">
          Selesaikan lebih banyak dengan lebih cepat. SwiftTask didesain agar
          Anda dapat mencatat dan mengelola tugas dalam waktu{" "}
          <span className="font-semibold text-zinc-900 dark:text-white">
            &lt; 15 detik
          </span>
          .
        </p>
        <div className="flex gap-4">
          <LoginButton />
        </div>
      </main>
    </div>
  );
}
