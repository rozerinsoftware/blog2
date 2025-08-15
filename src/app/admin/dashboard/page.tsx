import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.JWT_COOKIE_NAME || "blog_token")?.value || null;
  const payload = token ? verifyAuthToken(token) : null;
  
  if (!payload || payload.role !== "admin") {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Yetki gerekli</h1>
        <p className="mb-6 text-gray-600">Bu sayfayı görmek için admin yetkisine sahip olmalısınız.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Toplam Yazı</div>
          <div className="text-2xl font-semibold">5</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Admin Sayısı</div>
          <div className="text-2xl font-semibold">1</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Kullanıcı Sayısı</div>
          <div className="text-2xl font-semibold">10</div>
        </div>
      </div>
      
      <div className="mt-8 rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">Admin Paneli</h2>
        <p className="text-gray-600">Blog yazılarını yönetmek için yazılar sekmesini kullanın.</p>
      </div>
    </main>
  );
}


