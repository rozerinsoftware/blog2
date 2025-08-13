import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "./AdminNav";
import AdminPostsPanelWrapper from "./AdminPostsPanelWrapper";



export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get(process.env.JWT_COOKIE_NAME || "blog_token")?.value || null;
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload || payload.role !== "admin") {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Yetki gerekli</h1>
        <p className="mb-6 text-gray-600">
          Bu sayfayı görmek için admin yetkisine sahip olmalısınız.
        </p>
        <Link className="text-indigo-600 hover:underline" href="/login">
          Giriş sayfasına git
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Admin Paneli</h1>
      <p className="text-gray-600">Hoş geldin, {payload.email}</p>
      <div className="mt-6">
        <LogoutButton />
      </div>
      <div className="mt-6">
        <AdminNav />
      </div>
      <div className="mt-8">
        <AdminPostsPanelWrapper /> {/* ✅ sadece tarayıcıda render olacak */}
      </div>
    </main>
  );
}
