import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import Link from "next/link";
import AdminPostsPanel from "./posts-panel";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.JWT_COOKIE_NAME || "blog_token")?.value || null;
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload || payload.role !== 'admin') {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Yetki gerekli</h1>
        <p className="mb-6 text-gray-600">Bu sayfayı görmek için admin yetkisine sahip olmalısınız.</p>
        <Link className="text-indigo-600 hover:underline" href="/login">Giriş sayfasına git</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Admin Paneli</h1>
      <p className="text-gray-600">Hoş geldin, {payload.email}</p>
      <form action="/api/logout" method="post" className="mt-6">
        <button className="rounded-md bg-gray-800 px-3 py-2 text-white hover:bg-gray-700" type="submit">Çıkış Yap</button>
      </form>
      <div className="mt-8">
        <AdminPostsPanel />
      </div>
    </main>
  );
}


