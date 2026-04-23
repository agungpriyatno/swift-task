import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Data sesi dari Google OAuth.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                width={80}
                height={80}
                className="rounded-full border"
              />
            )}
            <div>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-zinc-500">{user.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
